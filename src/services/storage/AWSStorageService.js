const AWS = require('aws-sdk');
const AbstractStorageService = require("./abstractStorageService");

class AWSStorageService extends AbstractStorageService {
    s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    BUCKET_NAME = process.env.AWS_BUCKET_NAME;

    // return link
    async uploadFile(file, keyName, contentType) {
        const uploadParams = {
            Bucket: this.BUCKET_NAME,
            Key: keyName,
            Body: file.buffer,
            ContentType: contentType
        };

        const data = await this.s3.upload(uploadParams).promise();
        return data.Location
    }

}

module.exports = new AWSStorageService();