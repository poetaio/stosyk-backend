const {newInvoiceType} = require("./types");
const {paymentController} = require("../../controllers");
const {GraphQLNonNull} = require("graphql");
const {paymentDetailsInputType} = require("./types")

const createInvoice = {
    type: newInvoiceType,
    name: 'CreateInvoice',
    description: 'Create invoice',
    args:{
        package: {type: (GraphQLNonNull(paymentDetailsInputType))}
    },
    resolve: async (parent, args, context) => await paymentController.createInvoice(args, context)
};

module.exports = {
    createInvoice,
};
