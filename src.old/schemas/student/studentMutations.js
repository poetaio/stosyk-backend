const studentController = require('../../controllers/studentController');
const {GraphQLNonNull, GraphQLString} = require("graphql");
const { StudentType } = require('../types');

const registerStudent = {
    type: StudentType,
    name: "registerStudent",
    description: "Register student by name",
    args: {
        name: { type: GraphQLNonNull(GraphQLString) }
    },
    resolve: (parent, args, context) => studentController.create(args)
}

module.exports = {
    registerStudent
}
