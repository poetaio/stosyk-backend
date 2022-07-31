const {  GraphQLString, GraphQLNonNull, GraphQLBoolean} = require("graphql");
const { teacherController, studentController, accountController } =require('../../controllers');
const { TeacherInputType, TokenType, StudentProfileInputType} = require("./types");
const { resolveUserIdParsingMiddleware, resolveAuthMiddleware, resolveAuthMiddlewareUnverified} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");


const createAnonymousTeacher = {
    type: TokenType,
    name: 'createAnonymousTeacher',
    description: 'Create anonymous teacher',
    resolve: async (parent, args, context) => await teacherController.createAnonymous(args, context)
};

const registerTeacher = {
    type: TokenType,
    name: 'registerTeacher',
    description: 'Register Teacher',
    args: {
        teacher: { type: GraphQLNonNull(TeacherInputType) }
    },
    resolve: async (parent, args, context) => await accountController.registerTeacher(args, context)
};

const loginTeacher = {
    type: TokenType,
    name: 'loginTeacher',
    description: 'Login Teacher',
    args: {
        teacher: { type: GraphQLNonNull(TeacherInputType) }
    },
    resolve: async (parent, args, context) => await accountController.loginTeacher(args)
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

const confirmEmail = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'confirmEmail',
    description: 'Confirm Email',
    args: {
        confirmationCode: {type: GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await accountController.confirmEmail(args)
}

const resetPassword = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'resetPassword',
    description: 'Reset password',
    args: {
        resetPassCode: {type: GraphQLNonNull(GraphQLString)},
        password: {type: GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await accountController.resetPassword(args)
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

module.exports = {
    createAnonymousTeacher,
    registerTeacher: resolveUserIdParsingMiddleware(registerTeacher),
    loginTeacher,
    createAnonymousStudent,
    changePassword: resolveAuthMiddleware(UserRoleEnum.TEACHER)(changePassword),
    changeEmail: resolveAuthMiddleware(UserRoleEnum.TEACHER)(changeEmail),
    studentProfile: resolveAuthMiddleware(UserRoleEnum.STUDENT)(studentProfile),
    anonymousLogin: resolveAuthMiddlewareUnverified(anonymousLogin),
    confirmEmail,
    resetPassword,
};
