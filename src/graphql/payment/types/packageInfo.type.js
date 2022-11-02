const {GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLFloat, GraphQLID} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "packageInfoType",
    description: "Package Info Type",
    fields: {
        packageId: {type: new GraphQLNonNull(GraphQLID)},
        seats: {type : new GraphQLNonNull(GraphQLInt)},
        months: {type: new GraphQLNonNull(GraphQLInt)},
        priceUAH: {type: new GraphQLNonNull(GraphQLFloat)},
        priceUSD: {type: new GraphQLNonNull(GraphQLFloat)}
    },
});
