const {GraphQLNonNull, GraphQLID, GraphQLBoolean, GraphQLString, GraphQLList} = require("graphql");
const {invoiceStatusType, packageInfoType, userPackageInfoType} = require("./types");
const {paymentController} = require("../../controllers");
const {resolveAuthMiddleware} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");
const {userCardsType} = require("./types");


const checkInvoiceStatus = {
    type: invoiceStatusType,
    name: 'CheckInvoiceStatus',
    description: 'Check invoice status',
    args: {
        invoiceId: {type: new GraphQLNonNull(GraphQLID)}
    },
    resolve: async (parent, args, context) => await paymentController.checkInvoiceStatus(args, context)
};

const checkUserPackage = {
    type: userPackageInfoType,
    name: 'CheckUserPackage',
    description: 'Check User Package',
    resolve: async (parent, args, context) => await paymentController.checkUserPackage(context)
}

const userCards = {
    type: new GraphQLNonNull(userCardsType),
    name: 'userCards',
    description: 'user Cards',
    resolve: async (parent, args, context) => await paymentController.getUserCards(context)
}

const userWalletId = {
    type: new GraphQLNonNull(GraphQLString),
    name: 'userWalletId',
    description: 'User Wallet Id',
    resolve: async (parent, args, context) => await paymentController.userWalletId(context)
}

const packagesList = {
    type: new GraphQLNonNull(new GraphQLList(packageInfoType)),
    name: 'packagesList',
    description: 'Packages List',
    resolve: async ( parent, args, context ) => await paymentController.packagesList()
}

module.exports = {
    checkInvoiceStatus,
    checkUserPackage: resolveAuthMiddleware(UserRoleEnum.TEACHER)(checkUserPackage),
    getUserCards: resolveAuthMiddleware(UserRoleEnum.TEACHER)(userCards),
    userWalletId: resolveAuthMiddleware(UserRoleEnum.TEACHER)(userWalletId),
    packagesList
};
