const { GraphQLBoolean, GraphQLString, GraphQLNonNull} = require("graphql");
const { userController, accountController} = require('../../controllers');
const {resolveAuthMiddleware} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");
const {TokenType, UserAccInfoType} = require("./types");

// updates token if it's valid and not expired
const updateAuth = {
    type: new GraphQLNonNull(TokenType),
    name: 'UpdateAuth',
    description: 'Update Auth',
    resolve: async (parent, args, context) => await userController.updateUserAuth(context)
};


const userInfo = {
    type: UserAccInfoType,
    name: 'UserInfo',
    description: 'get User Info',
    resolve: async (arent, args, context) => await accountController.getUserInfo(context)
}

const sendConfirmationEmail = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'sendConfirmationEmail',
    description: 'Send confirmation email',
    args:{
        login: {type: new GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await accountController.sendConfirmationEmail(args)
}

const sendResetPassEmail = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'sendResetPassEmail',
    description: 'Send reset password email',
    args:{
        login: {type: new GraphQLNonNull(GraphQLString),}
    },
    resolve: async  (parent, args, context) => await accountController.sendResetPassEmail(args)
}


module.exports = {
    updateAuth: resolveAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(updateAuth),
    userInfo: resolveAuthMiddleware(UserRoleEnum.STUDENT, UserRoleEnum.TEACHER)(userInfo),
    sendConfirmationEmail,
    sendResetPassEmail,
};
