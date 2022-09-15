const {GraphQLList, GraphQLNonNull, GraphQLID} = require("graphql");
const { TaskStudentsAnswersInterfaceType, TeacherLessonType, LessonCorrectAnswersType, LessonStatusType, StudentCurrentTaskType} = require('./types');
const { StudentType } = require('../user/types');
const { lessonController } = require('../../controllers');
const { subscribeAuthMiddleware } = require("../../middleware");
const {UserRoleEnum} = require("../../utils");

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
    type: GraphQLList(GraphQLNonNull(TaskStudentsAnswersInterfaceType)),
    name: "studentAnswerChanged",
    description: "Student Answer Changed",
    args: {
        lessonId: {type: GraphQLNonNull(GraphQLID)},
    },
    subscribe: async (parent, args, context) => await lessonController.studentAnswersChanged(args, context)
};

const lessonStatusChanged = {
    type: LessonStatusType,
    name: "lessonStatusChanged",
    description: "Lesson Status Changed",
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

const getStudentCurrentPosition = {
    type: GraphQLNonNull(GraphQLList(StudentCurrentTaskType)),
    name: 'getStudentCurrentPosition',
    description: 'Get Student Current Position',
    args: {
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    subscribe: async (parent, args, context) => await lessonController.getStudentCurrentPosition(args, context)
}

module.exports = {
    presentStudentsChanged: subscribeAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(presentStudentsChanged),
    studentAnswersChanged: subscribeAuthMiddleware(UserRoleEnum.TEACHER)(studentAnswersChanged),
    lessonStatusChanged,
    correctAnswersShown: subscribeAuthMiddleware(UserRoleEnum.STUDENT)(correctAnswersShown),
    getStudentCurrentPosition: subscribeAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(getStudentCurrentPosition),
};
