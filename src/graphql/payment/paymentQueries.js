const {GraphQLNonNull, GraphQLID, GraphQLBoolean, GraphQLList, GraphQLString} = require("graphql");
const {invoiceStatusType} = require("./types");
const {paymentController} = require("../../controllers");
const {resolveAuthMiddleware} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");


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

const getUserCards = {
    type: GraphQLNonNull(GraphQLList(GraphQLString)),
    name: 'GetUserCards',
    description: 'Get User Cards',
    resolve: async (parent, args, context) => await paymentController.getUserCards(context)
}

module.exports = {
    checkInvoiceStatus,
    checkUserPackage: resolveAuthMiddleware(UserRoleEnum.TEACHER)(checkUserPackage),
    getUserCards: resolveAuthMiddleware(UserRoleEnum.TEACHER)(getUserCards)
};
