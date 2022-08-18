const {  GraphQLString, GraphQLNonNull, GraphQLBoolean} = require("graphql");
const { teacherController, studentController, accountController } =require('../../controllers');
const { TeacherInputType, TokenType, StudentProfileInputType, StudentInputType, StudentLoginInputType} = require("./types");
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

const registerStudent = {
    type: TokenType,
    name: 'registerStudent',
    description: 'Register Student',
    args: {
        student: {type: GraphQLNonNull(StudentInputType)}
    },
    resolve: async (parent, args, context) => await accountController.registerStudent(args, context)
}

const loginUser = {
    type: TokenType,
    name: 'loginUser',
    description: 'Login User',
    args: {
        user: { type: GraphQLNonNull(TeacherInputType) }
    },
    resolve: async (parent, args, context) => await accountController.loginUser(args)
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
        name: {type: GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await accountController.changeName(args, context)
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
    registerStudent: resolveUserIdParsingMiddleware(registerStudent),
    loginUser,
    createAnonymousStudent,
    changePassword: resolveAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(changePassword),
    changeEmail: resolveAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(changeEmail),
    changeName: resolveAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(changeName),
    studentProfile: resolveAuthMiddleware(UserRoleEnum.STUDENT)(studentProfile),
    anonymousLogin: resolveAuthMiddlewareUnverified(anonymousLogin),
    confirmEmail
};
