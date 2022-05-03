const {GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLList, GraphQLID} = require("graphql");
const { StudentSentenceType } = require("../sentence");
const { sentenceController } = require("../../../../controllers");
const AttachmentType = require("./Attachment.type");

module.exports = new GraphQLObjectType({
    name: 'StudentTaskType',
    description: 'Student Task Type',
    fields: {
        taskId: { type: GraphQLNonNull(GraphQLID) },
        answersShown: { type: GraphQLNonNull(GraphQLBoolean) },
        sentences: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentSentenceType))),
            resolve: async (parent, args, context) =>
                await sentenceController.getSentences(parent, args, context)
        },
        attachments: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(AttachmentType)))
        }
    }
});
