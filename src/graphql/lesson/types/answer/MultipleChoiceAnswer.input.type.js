const {GraphQLNonNull, GraphQLID, GraphQLInputObjectType} = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: "MultipleChoiceAnswerInputType",
    description: "Contains sentenceId, gapId and optionId student chosen",
    fields: {
        sentenceId: { type: new GraphQLNonNull(GraphQLID) },
        gapId: { type: new GraphQLNonNull(GraphQLID) },
        optionId: { type: new GraphQLNonNull(GraphQLID) },
    },
});
