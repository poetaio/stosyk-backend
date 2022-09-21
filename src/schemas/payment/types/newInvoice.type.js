const {GraphQLString, GraphQLNonNull, GraphQLObjectType, GraphQLID} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "NewInvoiceType",
    description: "New Invoice Type",
    fields: {
        invoiceId: { type: GraphQLNonNull(GraphQLID) },
        pageUrl: { type: GraphQLNonNull(GraphQLString) }
    },
});
