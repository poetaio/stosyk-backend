const {GraphQLNonNull, GraphQLID} = require("graphql");
const {invoiceStatusType} = require("./types");
const {paymentController} = require("../../controllers");


const checkInvoiceStatus = {
    type: invoiceStatusType,
    name: 'CheckInvoiceStatus',
    description: 'Check invoice status',
    args: {
        invoiceId: {type: new GraphQLNonNull(GraphQLID)}
    },
    resolve: async (parent, args, context) => await paymentController.checkInvoiceStatus(args, context)
};

module.exports = {
    checkInvoiceStatus,
};
