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

const subPackage = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'subscriptionPackage',
    description: 'Subscription Package',
    args: {
        package: {type: new GraphQLNonNull(subPackageInputType)}
    },
    resolve: async (parent, args, context) => await paymentController.addSubPackage(args)
}

module.exports = {
    createInvoice: resolveAuthMiddleware(UserRoleEnum.TEACHER)(createInvoice),
    payByCard: resolveAuthMiddleware(UserRoleEnum.TEACHER)(payByCard),
    subPackage,
};
