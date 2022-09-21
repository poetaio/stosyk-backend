const {newInvoiceType} = require("./types");
const {paymentController} = require("../../controllers");

const createInvoice = {
    type: newInvoiceType,
    name: 'CreateInvoice',
    description: 'Create invoice',
    resolve: async (parent, args, context) => await paymentController.createInvoice(context)
};

module.exports = {
    createInvoice,
};
