const {GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID} = require("graphql");
const { SentenceCorrectAnswersType } = require('../sentence');


module.exports = new GraphQLObjectType({
    name: 'TaskCorrectAnswersType',
    description: 'Task Correct Answers Type',
    fields: {
        taskId: { type: GraphQLNonNull(GraphQLID) },
        sentencesAnswers: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SentenceCorrectAnswersType))) }
    }
});