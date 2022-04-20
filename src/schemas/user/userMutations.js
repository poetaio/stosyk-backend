const { GraphQLBoolean, GraphQLString, GraphQLNonNull} = require("graphql");
const { teacherController, studentController } =require('../../controllers');


const createAnonymousTeacher = {
    type: GraphQLBoolean,
    name: 'createAnonymousTeacher',
    description: 'Create anonymous teacher',
    resolve: async (parent, args, context) => teacherController.create(args, context)
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
    createAnonymousStudent
};
