const {GraphQLObjectType, GraphQLNonNull, GraphQLList} = require("graphql");
const GapCorrectAnswersType = require('./GapCorrectAnswers.type');


module.exports = new GraphQLObjectType({
    name: 'SentenceCorrectAnswersType',
    description: 'Sentence Correct Answers Type',
    fields: {
        gapsAnswers: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GapCorrectAnswersType))) }
    }
});
