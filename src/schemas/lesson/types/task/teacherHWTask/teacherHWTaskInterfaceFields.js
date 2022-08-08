const {GraphQLNonNull, GraphQLID, GraphQLList, GraphQLBoolean, GraphQLString} = require("graphql");
const AttachmentType = require("../Attachment.type");
const {attachmentController} = require("../../../../../controllers");
const TaskTypeEnumType = require("../TaskTypeEnum.type");

module.exports = {
    taskId: { type: GraphQLNonNull(GraphQLID) },
    attachments: {
        type: GraphQLNonNull(GraphQLList(GraphQLNonNull(AttachmentType))),
        resolve: async (parent, args, context) =>
            await attachmentController.getAttachments(parent, args, context)
    },
    answersShown: { type: GraphQLNonNull(GraphQLBoolean) },
    description: { type: GraphQLNonNull(GraphQLString) },
    type: { type: GraphQLNonNull(TaskTypeEnumType) },
};
