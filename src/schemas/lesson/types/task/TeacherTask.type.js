const {GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLList, GraphQLID} = require("graphql");
const { TeacherSentenceType } = require("../sentence");

module.exports = new GraphQLObjectType({
    name: 'TeacherTaskType',
    description: 'Teacher Task Type',
    fields: {
        taskId: { type: GraphQLNonNull(GraphQLID) },
        answerShown: { type: GraphQLNonNull(GraphQLBoolean) },
        sentences: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherSentenceType)))}
    }
});
