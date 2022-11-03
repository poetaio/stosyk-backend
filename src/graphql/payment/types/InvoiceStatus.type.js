const {GraphQLString, GraphQLNonNull, GraphQLObjectType, GraphQLID} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "InvoiceStatusType",
    description: "Invoice Status Type",
    fields: {
        invoiceId: { type: new GraphQLNonNull(GraphQLID) },
        status: {type: new GraphQLNonNull(GraphQLString) },
        modifiedDate: { type:new GraphQLNonNull(GraphQLString) }
    },
});
