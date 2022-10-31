const {GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID} = require("graphql");
const { GapCorrectAnswersType } = require('../gap');


module.exports = new GraphQLObjectType({
    name: 'SentenceCorrectAnswersType',
    description: 'Sentence Correct Answers Type',
    fields: {
        sentenceId: { type: new GraphQLNonNull(GraphQLID) },
        gapsAnswers: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GapCorrectAnswersType))) }
    }
});
