const {GraphQLNonNull, GraphQLInputObjectType, GraphQLInt} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "NewInvoiceType",
    description: "New Invoice Type",
    fields: {
        seats: {type :GraphQLNonNull(GraphQLInt)},
        months: {type: GraphQLNonNull(GraphQLInt)},
    },
});
