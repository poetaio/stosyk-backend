const { GraphQLObjectType, GraphQLNonNull, GraphQLID} = require("graphql");
const SentenceStudentsAnswersType = require('./SentenceStudentsAnswers.type');


module.exports = new GraphQLObjectType({
    name: 'TaskStudentAnswersType',
    description: 'Task student answers type',
    fields: {
        taskId: { type: GraphQLNonNull(GraphQLID) },
        sentences: { type: GraphQLNonNull(SentenceStudentsAnswersType) }
    }
});
