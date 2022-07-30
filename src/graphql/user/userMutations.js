const {  GraphQLString, GraphQLNonNull, GraphQLBoolean} = require("graphql");
const { teacherController, studentController, accountController } =require('../../controllers');
const {TokenType, StudentProfileInputType, UserAccInputType,
    UserLoginInputType
} = require("./types");
const { resolveUserIdParsingMiddleware, resolveAuthMiddleware, resolveAuthMiddlewareUnverified} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");


const createAnonymousTeacher = {
    type: TokenType,
    name: 'createAnonymousTeacher',
    description: 'Create anonymous teacher',
    resolve: async (parent, args, context) => await teacherController.createAnonymous(args, context)
};

const createAnonymousStudent = {
    type: TokenType,
    name: 'createAnonymousStudent',
    description: "Create Anonymous Student",
    args: {
        name: {type: GraphQLNonNull(GraphQLString)},
    },
    resolve: async (parent, args, context) => await studentController.createAnonymous(args)
};

const studentProfile = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: "StudentProfile",
    description: "Update student profile",
    args: {
        studentProfile: { type: GraphQLNonNull(StudentProfileInputType)},
    },
    resolve: async (parent, args, context) => await studentController.updateProfile(args, context)
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
        user: { type: GraphQLNonNull(UserAccInputType) }
    },
    resolve: async (parent, args, context) => await accountController.registerUser(args, context)
}

const loginUser = {
    type: TokenType,
    name: 'loginUser',
    description: 'Login User',
    args: {
        user: { type: GraphQLNonNull(UserLoginInputType) }
    },
    resolve: async (parent, args, context) => await accountController.loginUser(args)
};


const confirmEmail = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'confirmEmail',
    description: 'Confirm Email',
    args: {
        confirmationCode: {type: GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await accountController.confirmEmail(args, context)
}

const changeEmail = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'changeEmail',
    description: 'Change Email',
    args:{
        newEmail: {type: GraphQLNonNull(GraphQLString)},
        password: {type: GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await accountController.changeEmail(args, context)
}

const changeName = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'changeName',
    description: 'Change name',
    args:{
        newName: {type: GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await accountController.changeName(args, context)
}

const changePassword = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'changePassword',
    description: 'Change Password',
    args:{
        oldPassword: {type: GraphQLNonNull(GraphQLString)},
        newPassword: {type: GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await accountController.changePassword(args, context)
}

const changeAvatar = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'changeAvatar',
    description: 'Change Avatar',
    args: {
        newAvatarSource: {type: GraphQLNonNull(GraphQLString)}
    },
    resolve: async  (parent, args, context) => await accountController.changeAvatar(args, context)
}

module.exports = {
    createAnonymousTeacher,
    studentProfile: resolveAuthMiddleware(UserRoleEnum.STUDENT)(studentProfile),
    anonymousLogin: resolveAuthMiddlewareUnverified(anonymousLogin),
    createAnonymousStudent,
    registerUser: resolveUserIdParsingMiddleware(registerUser),
    loginUser,
    changePassword: resolveAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(changePassword),
    changeEmail: resolveAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(changeEmail),
    changeName: resolveAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(changeName),
    changeAvatar: resolveAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(changeAvatar),
    confirmEmail
};
