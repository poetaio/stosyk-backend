const {GraphQLInputObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLString, GraphQLInt} = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: "MatchingOptionInputType",
    description: "Contains value, and position(index) in right \"column\"",
    fields: {
        value: { type: GraphQLNonNull(GraphQLString) },
        rightColumnPosition: { type: GraphQLNonNull(GraphQLInt) },
    }
});
