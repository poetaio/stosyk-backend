const {GraphQLNonNull, GraphQLID, GraphQLInputObjectType} = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: "MatchingAnswerInputType",
    description: "Contains sentenceId from the right column and sentenceId from the left",
    fields: {
        sentenceId: { type: new GraphQLNonNull(GraphQLID) },
        optionId: { type: new GraphQLNonNull(GraphQLID) },
    },
});
