const { GraphQLBoolean, GraphQLString, GraphQLNonNull} = require("graphql");
const { teacherController, studentController, accountController } =require('../../controllers');
const { TeacherInputType, TokenType} = require("./types");


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
    resolve: async (parent, args, context) => await accountController.registerTeacher(args)
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
    resolve: async (parent, args, context) => await studentController.createAnonymous(args, context)
};


module.exports = {
    createAnonymousTeacher,
    registerTeacher,
    loginTeacher,

    createAnonymousStudent
};
