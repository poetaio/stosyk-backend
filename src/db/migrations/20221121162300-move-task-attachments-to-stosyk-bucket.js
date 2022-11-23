require('dotenv').config();
const AWS = require('aws-sdk');

const SELECT_ALL_TASK_ATTACHMENTS = `
    SELECT * 
    FROM "taskAttachments"
`;

const UPDATE_SOURCE_BY_ATTACHMENT_ID = `
    UPDATE "taskAttachments"
    SET source = ?
    WHERE id = ?
`;

const newS3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const OLD_BUCKET_NAME = process.env.AWS_BUCKET_NAME_OLD;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) =>
            // selecting all attachments
            queryInterface.sequelize.query(SELECT_ALL_TASK_ATTACHMENTS, { transaction })
                .then(([attachments]) => Promise.all(
                    attachments.map(
                        async ({ id, source, contentType}) => {
                            if ('VIDEO' === contentType) return;

                            // copying attachment to new bucket
                            const sourceSplit = source.split('/');
                            const sourceType = sourceSplit[sourceSplit.length - 2];
                            const sourceUUID = sourceSplit[sourceSplit.length - 1];
                            const copyParams = {
                                Bucket : BUCKET_NAME,
                                CopySource : OLD_BUCKET_NAME + "/" + sourceType + "/" + sourceUUID,
                                Key : sourceType + "/" + id,
                            };

                            await newS3.copyObject(copyParams).promise()

                            const newLocation = `https://${BUCKET_NAME}.s3.amazonaws.com/${sourceType}/${id}`;

                            // updating the location of attachment in db
                            await queryInterface.sequelize.query({
                                query: UPDATE_SOURCE_BY_ATTACHMENT_ID,
                                values: [newLocation, id],
                            });
                        }
                    )
                ))
        )
    },

    async down(queryInterface, Sequelize) {},
};
