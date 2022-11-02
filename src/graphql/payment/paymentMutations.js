const {newInvoiceType} = require("./types");
const {paymentController} = require("../../controllers");
const {GraphQLNonNull, GraphQLBoolean, GraphQLString, GraphQLID} = require("graphql");
const {subPackageInputType, userCardsType} = require("./types")
const {resolveAuthMiddleware} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");

const createInvoice = {
    type: newInvoiceType,
    name: 'CreateInvoice',
    description: 'Create invoice',
    args:{
        packageId: {type: new GraphQLNonNull(GraphQLID)}
    },
    resolve: async (parent, args, context) => await paymentController.createInvoice(args, context)
};

const payByCard = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'PayByCard',
    description: 'Pay By Card',
    args: {
        package: {type: new GraphQLNonNull(GraphQLID)},
        cardMask: {type: new GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await paymentController.payByCard(args, context)
}

const addPricingPackage = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'addPricingPackage',
    description: 'Add Pricing Package',
    args: {
        package: {type: new GraphQLNonNull(subPackageInputType)}
    },
    resolve: async (parent, args, context) => await paymentController.addSubPackage(args)
}

const deletePricingPackage = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'deletePricingPackage',
    description: 'delete Pricing Package',
    args: {
        packageId: {type: new GraphQLNonNull(GraphQLID)}
    },
    resolve: async (parent, args, context) => await paymentController.deleteSubPackage(args)
}

module.exports = {
    createInvoice: resolveAuthMiddleware(UserRoleEnum.TEACHER)(createInvoice),
    payByCard: resolveAuthMiddleware(UserRoleEnum.TEACHER)(payByCard),
    addPricingPackage,
    deletePricingPackage
};
