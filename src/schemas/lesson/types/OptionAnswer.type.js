const { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLObjectType} = require("graphql");


module.exports = new GraphQLObjectType({
    name: "OptionAnswerType",
    description: "Option Answer type",
    fields: {
        optionId: { type: GraphQLNonNull(GraphQLID) },
        value: { type: GraphQLNonNull(GraphQLString) }
    }
});
