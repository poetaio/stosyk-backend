const {GraphQLNonNull, GraphQLID, GraphQLInputObjectType} = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: "PlainInputAnswerInputType",
    description: "Contains sentenceId, gapId and input student entered",
    fields: {
        sentenceId: { type: GraphQLNonNull(GraphQLID) },
        gapId: { type: GraphQLNonNull(GraphQLID) },
        input: { type: GraphQLNonNull(GraphQLID) },
    },
});
