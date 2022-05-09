const {GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLList, GraphQLID} = require("graphql");
const { TeacherSentenceType } = require("../sentence");
const TaskTypeEnumType = require("./TaskTypeEnum.type");
const { sentenceController, attachmentController} = require("../../../../controllers");
const AttachmentType = require("./Attachment.type");

module.exports = new GraphQLObjectType({
    name: 'TeacherTaskType',
    description: 'Teacher Task Type',
    fields: {
        taskId: { type: GraphQLNonNull(GraphQLID) },
        type: { type: GraphQLNonNull(TaskTypeEnumType) },
        answersShown: { type: GraphQLNonNull(GraphQLBoolean) },
        sentences: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherSentenceType))),
            resolve: async (parent, args, context) =>
                await sentenceController.getSentences(parent, args, context)
        },
        attachments: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(AttachmentType))),
            resolve: async (parent, args, context) =>
                await attachmentController.getAttachments(parent, args, context)
        }
    }
});