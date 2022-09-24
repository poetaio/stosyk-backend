const { GraphQLBoolean, GraphQLString, GraphQLNonNull} = require("graphql");
const { userController, accountController} = require('../../controllers');
const {resolveAuthMiddleware} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");
const {TokenType, UserAccInfoType } = require("./types");

// updates token if it's valid and not expired
const checkTeacherAuth = {
    type: GraphQLNonNull(TokenType),
    name: 'checkTeacherAuth',
    description: 'Check teacher auth',
    resolve: async (parent, args, context) => await userController.checkTeacherAuth(context)
};

// updates token if it's valid and not expired
const checkStudentAuth = {
    type: GraphQLNonNull(TokenType),
    name: 'checkStudentAuth',
    description: 'Check student auth',
    resolve: async (parent, args, context) => await userController.checkStudentAuth(context)
};

const isUserRegistered = {
    type: GraphQLBoolean,
    name: 'isUserRegistered',
    description: 'Is user registered',
    resolve: async (parent, args, context) => await userController.isRegistered(context)
}


const getAccountInfo = {
    type: UserAccInfoType,
    name: 'getAccountInfo',
    description: 'Get account info',
    resolve: async (arent, args, context) => await accountController.getAccountInfo(context)
}

const sendConfirmationEmail = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'sendConfirmationEmail',
    description: 'Send confirmation email',
    args:{
        login: {type: GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await accountController.sendConfirmationEmail(args)
}


module.exports = {
    checkTeacherAuth: resolveAuthMiddleware(UserRoleEnum.TEACHER)(checkTeacherAuth),
    checkStudentAuth: resolveAuthMiddleware(UserRoleEnum.STUDENT)(checkStudentAuth),
    isUserRegistered: resolveAuthMiddleware(UserRoleEnum.TEACHER)(isUserRegistered),
    getAccountInfo: resolveAuthMiddleware(UserRoleEnum.STUDENT, UserRoleEnum.TEACHER)(getAccountInfo),
    sendConfirmationEmail,
};