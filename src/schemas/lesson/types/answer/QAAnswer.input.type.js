const {GraphQLNonNull, GraphQLID, GraphQLInputObjectType} = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: "QAAnswerInputType",
    description: "Contains questionId and input student entered",
    fields: {
        questionId: { type: GraphQLNonNull(GraphQLID) },
        input: { type: GraphQLNonNull(GraphQLID) },
    },
});
