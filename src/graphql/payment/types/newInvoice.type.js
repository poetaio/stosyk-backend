const {GraphQLString, GraphQLNonNull, GraphQLObjectType, GraphQLID} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "NewInvoiceType",
    description: "New Invoice Type",
    fields: {
        invoiceId: { type: new GraphQLNonNull(GraphQLID) },
        pageUrl: { type: new GraphQLNonNull(GraphQLString) }
    },
});
