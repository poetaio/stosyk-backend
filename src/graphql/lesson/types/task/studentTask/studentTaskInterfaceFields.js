const {GraphQLNonNull, GraphQLID, GraphQLBoolean, GraphQLList, GraphQLString} = require("graphql");
const AttachmentType = require("../Attachment.type");
const {attachmentController} = require("../../../../../controllers");
const TaskTypeEnumType = require("../TaskTypeEnum.type");

module.exports = {
    taskId: { type: new GraphQLNonNull(GraphQLID) },
    answersShown: { type: new GraphQLNonNull(GraphQLBoolean) },
    attachments: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AttachmentType))),
        resolve: async (parent, args, context) =>
            await attachmentController.getAttachments(parent, args, context)
    },
    description: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(TaskTypeEnumType) },
};
