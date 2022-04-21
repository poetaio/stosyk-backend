const { GraphQLBoolean } = require("graphql");
const { userController } = require('../../controllers');

const checkTeacherAuth = {
    type: GraphQLBoolean,
    name: 'checkTeacherAuth',
    description: 'Check teacher auth',
    resolve: async (parent, args, context) => await userController.checkTeacherAuth(args, context)
};

const checkStudentAuth = {
    type: GraphQLBoolean,
    name: 'checkStudentAuth',
    description: 'Check student auth',
    resolve: async (parent, args, context) => await userController.checkStudentAuth(args, context)
};


module.exports = {
    checkTeacherAuth,
    checkStudentAuth
};
