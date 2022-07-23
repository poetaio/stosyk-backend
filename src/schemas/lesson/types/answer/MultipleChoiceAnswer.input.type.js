const {GraphQLNonNull, GraphQLID, GraphQLInputObjectType} = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: "MultipleChoiceAnswerInputType",
    description: "Contains sentenceId, gapId and optionId student chosen",
    fields: {
        sentenceId: { type: GraphQLNonNull(GraphQLID) },
        gapId: { type: GraphQLNonNull(GraphQLID) },
        optionId: { type: GraphQLNonNull(GraphQLID) },
    },
});
