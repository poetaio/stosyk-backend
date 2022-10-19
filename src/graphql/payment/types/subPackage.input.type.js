const {GraphQLNonNull, GraphQLInputObjectType, GraphQLInt, GraphQLFloat} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "subPackageInputType",
    description: "Sub Package Input Type",
    fields: {
        seats: {type :GraphQLNonNull(GraphQLInt)},
        months: {type: GraphQLNonNull(GraphQLInt)},
        priceUAH: {type: GraphQLNonNull(GraphQLFloat)},
        priceUSD: {type: GraphQLNonNull(GraphQLFloat)}
    },
});
