const {GraphQLNonNull, GraphQLList, GraphQLInt, GraphQLString, GraphQLInputObjectType} = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: "GapCreateType",
    description: "Gap type containing list of options string values and right option string value",
    fields: {
        gapPosition: { type: GraphQLNonNull(GraphQLInt) },
        options: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString)))},
        rightOption: { type: GraphQLNonNull(GraphQLString) }
    }
});
