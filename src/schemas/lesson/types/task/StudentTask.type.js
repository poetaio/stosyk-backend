const {GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLList, GraphQLID} = require("graphql");
const { StudentSentenceType } = require("../sentence");
const {sentenceController} = require("../../../../controllers");
const TaskTypeEnumType = require("./TaskTypeEnum.type");

module.exports = new GraphQLObjectType({
    name: 'StudentTaskType',
    description: 'Student Task Type',
    fields: {
        taskId: { type: GraphQLNonNull(GraphQLID) },
        type: { type: GraphQLNonNull(TaskTypeEnumType) },
        answersShown: { type: GraphQLNonNull(GraphQLBoolean) },
        sentences: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentSentenceType))),
            resolve: async (parent, args, context) =>
                await sentenceController.getSentences(parent, args, context)
        }
    }
});
