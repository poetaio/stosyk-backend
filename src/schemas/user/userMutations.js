const {  GraphQLString, GraphQLNonNull, GraphQLBoolean} = require("graphql");
const { teacherController, studentController, accountController } =require('../../controllers');
const { TeacherInputType, TokenType} = require("./types");
const { resolveUserIdParsingMiddleware, resolveAuthMiddleware} = require("../../middleware");
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
    resolve: async (parent, args, context) => await accountController.confirmEmail(args, context)
}


module.exports = {
    createAnonymousTeacher,
    registerTeacher: resolveUserIdParsingMiddleware(registerTeacher),
    loginTeacher,
    createAnonymousStudent,
    changePassword: resolveAuthMiddleware(UserRoleEnum.TEACHER)(changePassword),
    confirmEmail
};
