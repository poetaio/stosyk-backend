const {GraphQLNonNull, GraphQLInputObjectType, GraphQLInt, GraphQLFloat} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "subPackageInputType",
    description: "Sub Package Input Type",
    fields: {
        seats: {type : new GraphQLNonNull(GraphQLInt)},
        months: {type: new GraphQLNonNull(GraphQLInt)},
        priceUAH: {type: new GraphQLNonNull(GraphQLFloat)},
        priceUSD: {type: new GraphQLNonNull(GraphQLFloat)}
    },
});
