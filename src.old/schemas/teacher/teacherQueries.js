const {GraphQLNonNull, GraphQLID} = require("graphql");
const teacherController = require('../../controllers/teacherController');
const { TeacherType } = require('../types');

const teacher = {
    type: TeacherType,
    name: "teacher",
    description: "Get teacher by id",
    args: {
        id: { type: GraphQLNonNull(GraphQLID)}
    },
    resolve: (parent, args, context) => teacherController.getOne(args)
}

module.exports = {
    teacher
};