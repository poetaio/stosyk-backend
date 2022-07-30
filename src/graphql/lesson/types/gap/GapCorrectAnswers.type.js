const {GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID} = require("graphql");
const { OptionAnswerType } = require('../option');


module.exports = new GraphQLObjectType({
    name: 'GapCorrectAnswersType',
    description: 'Gap Correct Answers Type',
    fields: {
        gapId: { type: GraphQLNonNull(GraphQLID) },
        correctAnswers: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(OptionAnswerType))) }
    }
});
