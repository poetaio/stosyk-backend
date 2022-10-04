const {GraphQLNonNull, GraphQLID, GraphQLBoolean, GraphQLList, GraphQLString} = require("graphql");
const AttachmentType = require("../Attachment.type");
const {attachmentController} = require("../../../../../controllers");
const TaskTypeEnumType = require("../TaskTypeEnum.type");

module.exports = {
    taskId: { type: GraphQLNonNull(GraphQLID) },
    answersShown: { type: GraphQLNonNull(GraphQLBoolean) },
    attachments: {
        type: GraphQLNonNull(GraphQLList(GraphQLNonNull(AttachmentType))),
        resolve: async (parent, args, context) =>
            await attachmentController.getAttachments(parent, args, context)
    },
    description: { type: GraphQLNonNull(GraphQLString) },
    type: { type: GraphQLNonNull(TaskTypeEnumType) },
};
