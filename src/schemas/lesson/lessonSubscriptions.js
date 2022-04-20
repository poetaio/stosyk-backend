const {GraphQLList, GraphQLNonNull, GraphQLID} = require("graphql");
const { TaskStudentsAnswersType } = require('./types');
const { StudentType } = require('../user/types');
const { lessonController } = require('../../controllers');

const presentStudents = {
    type: GraphQLList(GraphQLNonNull(StudentType)),
    name: 'presentStudents',
    description: 'Present Students',
    args: {
        lessonId: {type: GraphQLNonNull(GraphQLID)},
    },
    subscribe: async (parent, args, context) => await  lessonController.presentStudents(args, context)
};

const studentAnswersChanged = {
    type: GraphQLList(GraphQLNonNull(TaskStudentsAnswersType)),
    name: "studentAnswerChanged",
    description: "Student Answer Changed",
    args: {
        lessonId: {type: GraphQLNonNull(GraphQLID)},
    },
    subscribe: async (parent, args, context) => await lessonController.studentAnswerChanged(args, context)
};

module.exports = {
    presentStudents,
    studentAnswersChanged,
};
