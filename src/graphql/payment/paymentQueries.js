const {GraphQLNonNull, GraphQLID, GraphQLBoolean, GraphQLList, GraphQLString} = require("graphql");
const {invoiceStatusType} = require("./types");
const {paymentController} = require("../../controllers");
const {resolveAuthMiddleware} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");
const {userCardsType} = require("./types");


const checkInvoiceStatus = {
    type: invoiceStatusType,
    name: 'CheckInvoiceStatus',
    description: 'Check invoice status',
    args: {
        invoiceId: {type: GraphQLNonNull(GraphQLID)}
    },
    resolve: async (parent, args, context) => await paymentController.checkInvoiceStatus(args, context)
};

const checkUserPackage = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'CheckUserPackage',
    description: 'Check User Package',
    resolve: async (parent, args, context) => await paymentController.checkUserPackage(context)
}

const userCards = {
    type: GraphQLNonNull(userCardsType),
    name: 'userCards',
    description: 'user Cards',
    resolve: async (parent, args, context) => await paymentController.getUserCards(context)
}

const userWalletId = {
    type: GraphQLNonNull(GraphQLString),
    name: 'userWalletId',
    description: 'User Wallet Id',
    resolve: async (parent, args, context) => await paymentController.userWalletId(context)
}

module.exports = {
    checkInvoiceStatus,
    checkUserPackage: resolveAuthMiddleware(UserRoleEnum.TEACHER)(checkUserPackage),
    getUserCards: resolveAuthMiddleware(UserRoleEnum.TEACHER)(userCards),
    userWalletId: resolveAuthMiddleware(UserRoleEnum.TEACHER)(userWalletId)
};
