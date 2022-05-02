const {GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLList, GraphQLID} = require("graphql");
const { TeacherSentenceType } = require("../sentence");
const { sentenceController } = require("../../../../controllers");
const TaskTypeEnumType = require("./TaskTypeEnum.type");

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
        }
    }
});
