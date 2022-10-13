const {GraphQLNonNull, GraphQLID, GraphQLInputObjectType} = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: "PlainInputAnswerInputType",
    description: "Contains sentenceId, gapId and input student entered",
    fields: {
        sentenceId: { type: new GraphQLNonNull(GraphQLID) },
        gapId: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(GraphQLID) },
    },
});
