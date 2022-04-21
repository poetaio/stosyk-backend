const {GraphQLObjectType, GraphQLNonNull, GraphQLList} = require("graphql");
const SentenceCorrectAnswersType = require('./SentenceCorrectAnswers.type');


module.exports = new GraphQLObjectType({
    name: 'TaskCorrectAnswersType',
    description: 'Task Correct Answers Type',
    fields: {
        sentencesAnswers: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SentenceCorrectAnswersType))) }
    }
});
