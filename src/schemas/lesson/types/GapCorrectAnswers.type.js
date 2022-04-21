const {GraphQLObjectType, GraphQLNonNull, GraphQLList} = require("graphql");
const OptionAnswerType = require('./OptionAnswer.type');


module.exports = new GraphQLObjectType({
    name: 'GapCorrectAnswersType',
    description: 'Gap Correct Answers Type',
    fields: {
        correctAnswers: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(OptionAnswerType))) }
    }
});
