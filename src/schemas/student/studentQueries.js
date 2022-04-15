const {GraphQLNonNull, GraphQLID} = require("graphql");
const studentController = require('../../controllers/studentController');
const { StudentType } = require('../types');

const student = {
    type: StudentType,
    name: "student",
    description: "Get user by id",
    args: {
        id: { type: GraphQLNonNull(GraphQLID)}
    },
    resolve: (parent, args, context) => studentController.getOne(args)
}

module.exports = {
    student
};