const {newInvoiceType} = require("./types");
const {paymentController} = require("../../controllers");
const {GraphQLNonNull, GraphQLBoolean, GraphQLString} = require("graphql");
const {paymentDetailsInputType, subPackageInputType, userCardsType} = require("./types")
const {resolveAuthMiddleware} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");

const createInvoice = {
    type: newInvoiceType,
    name: 'CreateInvoice',
    description: 'Create invoice',
    args:{
        package: {type: new GraphQLNonNull(paymentDetailsInputType)}
    },
    resolve: async (parent, args, context) => await paymentController.createInvoice(args, context)
};

const payByCard = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'PayByCard',
    description: 'Pay By Card',
    args: {
        package: {type: new GraphQLNonNull(paymentDetailsInputType)},
        cardMask: {type: new GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await paymentController.payByCard(args, context)
}

const subPackage = {
    type: userCardsType,
    name: 'subscriptionPackage',
    description: 'Subscription Package',
    args: {
        package: {type: new GraphQLNonNull(subPackageInputType)}
    },
    resolve: async (parent, args, context) => await paymentController.addSubPackage(args, context)
}

module.exports = {
    createInvoice: resolveAuthMiddleware(UserRoleEnum.TEACHER)(createInvoice),
    payByCard: resolveAuthMiddleware(UserRoleEnum.TEACHER)(payByCard),
    subPackage,
};
