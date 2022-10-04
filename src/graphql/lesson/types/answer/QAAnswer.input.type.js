const {GraphQLNonNull, GraphQLID, GraphQLInputObjectType} = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: "QAAnswerInputType",
    description: "Contains questionId and optionId student chose",
    fields: {
        questionId: { type: GraphQLNonNull(GraphQLID) },
        optionId: { type: GraphQLNonNull(GraphQLID) },
    },
});
