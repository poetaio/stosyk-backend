const {newInvoiceType} = require("./types");
const {paymentController} = require("../../controllers");
const {GraphQLNonNull} = require("graphql");
const {paymentDetailsInputType, subPackageInputType, userCardsType} = require("./types")

const createInvoice = {
    type: newInvoiceType,
    name: 'CreateInvoice',
    description: 'Create invoice',
    args:{
        package: {type: (GraphQLNonNull(paymentDetailsInputType))}
    },
    resolve: async (parent, args, context) => await paymentController.createInvoice(args, context)
};

const addSubPackage = {
    type: userCardsType,
    name: 'AddSubscriptionPackage',
    description: 'Add Subscription Package',
    args: {
        package: {type: (GraphQLNonNull(subPackageInputType))}
    },
    resolve: async (parent, args, context) => await paymentController.addSubPackage(args, context)
}

module.exports = {
    createInvoice,
    addSubPackage
};
