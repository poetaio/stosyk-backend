const {GraphQLList, GraphQLNonNull, GraphQLID} = require("graphql");
const { TaskStudentsAnswersType, LessonType, LessonCorrectAnswersType} = require('./types');
const { StudentType } = require('../user/types');
const { lessonController } = require('../../controllers');

const presentStudentsChanged = {
    type: GraphQLList(GraphQLNonNull(StudentType)),
    name: 'presentStudentsChanged',
    description: 'Present Students Changed',
    args: {
        //teacher or student id in token
        lessonId: {type: GraphQLNonNull(GraphQLID)},
    },
    subscribe: async (parent, args, context) => await lessonController.presentStudentsChanged(args, context)
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

const lessonStatusChanged = {
    type: LessonType,
    name: "lessonStatusChanged",
    descpription: "Lesson Status Changed",
    args: {
        lessonId: {type: GraphQLNonNull(GraphQLID)},
    },
subscribe: async (parent, args, context) => await lessonController.lessonStatusChanged(args, context)
}

const correctAnswersShown = {
    type: LessonCorrectAnswersType,
    name: 'correctAnswerShown',
    description: 'correct answer shown',
    args: {
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    subscribe: async (parent, args, context) => await lessonController.correctAnswerShown(args, context)
}

module.exports = {
    presentStudentsChanged,
    studentAnswersChanged,
    lessonStatusChanged,
    correctAnswersShown,
};
