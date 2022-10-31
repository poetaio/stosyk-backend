const {GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID} = require("graphql");
const { OptionAnswerType } = require('../option');


module.exports = new GraphQLObjectType({
    name: 'GapCorrectAnswersType',
    description: 'Gap Correct Answers Type',
    fields: {
        gapId: { type: new GraphQLNonNull(GraphQLID) },
        correctAnswers: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(OptionAnswerType))) }
    }
});
