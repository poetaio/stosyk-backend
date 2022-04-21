const { GraphQLBoolean, GraphQLString, GraphQLNonNull} = require("graphql");
const { teacherController, studentController, accountController } =require('../../controllers');
const {TeacherInputType} = require("./types");


const createAnonymousTeacher = {
    type: GraphQLBoolean,
    name: 'createAnonymousTeacher',
    description: 'Create anonymous teacher',
    resolve: async (parent, args, context) => teacherController.create(args, context)
};

const registerTeacher = {
    type: GraphQLBoolean,
    name: 'registerTeacher',
    description: 'Register Teacher',
    args: {
        teacher: { type: GraphQLNonNull(TeacherInputType) }
    },
    resolve: async (parent, args, context) => await accountController.registerTeacher(args)
};

const loginTeacher = {
    type: GraphQLBoolean,
    name: 'loginTeacher',
    description: 'Login Teacher',
    args: {
        teacher: { type: GraphQLNonNull(TeacherInputType) }
    },
    resolve: async (parent, args, context) => await accountController.loginTeacher(args)
};

const createAnonymousStudent = {
    type: GraphQLBoolean,
    name: 'createAnonymousStudent',
    description: "Create Anonymous Student",
    args: {
        name: {type: GraphQLNonNull(GraphQLString)},
    },
    resolve: async (parent, args, context) => studentController.create(args, context)
};


module.exports = {
    createAnonymousTeacher,
    registerTeacher,
    loginTeacher,

    createAnonymousStudent
};
