const {GraphQLNonNull, GraphQLID, GraphQLList, GraphQLBoolean, GraphQLString} = require("graphql");
const AttachmentType = require("../Attachment.type");
const {attachmentController} = require("../../../../../controllers");
const TaskTypeEnumType = require("../TaskTypeEnum.type");

module.exports = {
    taskId: { type: new GraphQLNonNull(GraphQLID) },
    attachments: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AttachmentType))),
        resolve: async (parent, args, context) =>
            await attachmentController.getAttachments(parent, args, context)
    },
    answersShown: { type: new GraphQLNonNull(GraphQLBoolean) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(TaskTypeEnumType) },
};
