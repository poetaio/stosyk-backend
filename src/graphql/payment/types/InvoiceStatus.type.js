//"invoiceId": "p2_9ZgpZVsl3",
// "status": "created",
// "failureReason": "string",
// "amount": 4200,
// "ccy": 980,
// "finalAmount": 4200,
// "createdDate": "2019-08-24T14:15:22Z",
// "modifiedDate": "2019-08-24T14:15:22Z",
// "reference": "84d0070ee4e44667b31371d8f8813947",
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
