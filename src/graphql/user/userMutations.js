const {  GraphQLString, GraphQLNonNull, GraphQLBoolean} = require("graphql");
const { accountController, userController} =require('../../controllers');
const {
    TokenType,
    UserAccInputType,
    UserLoginInputType, UserProfileInputType
} = require("./types");
const { resolveUserIdParsingMiddleware, resolveAuthMiddleware, resolveAuthMiddlewareUnverified} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");
const UserRoleEnumType = require("./types/user/UserRoleEnum.type");


const createAnonymousUser = {
    type: TokenType,
    name: 'createAnonymousUser',
    description: 'Create Anonymous User',
    args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        type: {type: new GraphQLNonNull(UserRoleEnumType)}
    },
    resolve: async (parent, args, context) => await userController.createAnonymous(args, context)
}

const changeUserProfile = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: "changeUserProfile",
    description: "Update student profile",
    args: {
        userProfile: { type: new GraphQLNonNull(UserProfileInputType)},
    },
    resolve: async (parent, args, context) => await userController.updateProfile(args, context)
}

const anonymousLogin = {
    type: TokenType,
    name: 'anonymousLogin',
    description: 'Login Anonymous Teacher & Student',
    resolve: async (parent, args, context) => await accountController.anonymousAuth(context)
}

// account Mutations

const registerUser = {
    type: TokenType,
    name: 'registerUser',
    description: 'Register User',
    args: {
        user: { type: new GraphQLNonNull(UserAccInputType) }
    },
    resolve: async (parent, args, context) => await accountController.registerUser(args, context)
}

const loginUser = {
    type: TokenType,
    name: 'loginUser',
    description: 'Login User',
    args: {
        user: { type: new GraphQLNonNull(UserLoginInputType) }
    },
    resolve: async (parent, args, context) => await accountController.loginUser(args)
};


const confirmEmail = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'confirmEmail',
    description: 'Confirm Email',
    args: {
        confirmationCode: {type: new GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await accountController.confirmEmail(args)
}

const resetPassword = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'resetPassword',
    description: 'Reset password',
    args: {
        resetPassCode: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await accountController.resetPassword(args)
}

const changeEmail = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'changeEmail',
    description: 'Change Email',
    args:{
        newEmail: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await accountController.changeEmail(args, context)
}

const changePassword = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'changePassword',
    description: 'Change Password',
    args:{
        oldPassword: {type: new GraphQLNonNull(GraphQLString)},
        newPassword: {type: new GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await accountController.changePassword(args, context)
}

const changeAvatar = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'changeAvatar',
    description: 'Change Avatar',
    args: {
        name: { type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: async  (parent, args, context) => await accountController.changeAvatar(args, context)
}

module.exports = {
    createAnonymousUser,
    changeUserProfile: resolveAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(changeUserProfile),
    anonymousLogin: resolveAuthMiddlewareUnverified(anonymousLogin),
    registerUser: resolveUserIdParsingMiddleware(registerUser),
    loginUser,
    changePassword: resolveAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(changePassword),
    changeEmail: resolveAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(changeEmail),
    changeAvatar: resolveAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(changeAvatar),
    confirmEmail,
    resetPassword,
};
