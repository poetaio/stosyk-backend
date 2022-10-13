const {GraphQLList, GraphQLNonNull, GraphQLID, GraphQLBoolean} = require("graphql");
const { TaskStudentsAnswersInterfaceType, TeacherLessonType, LessonCorrectAnswersType, LessonStatusType, StudentCurrentTaskType} = require('./types');
const { StudentType } = require('../user/types');
const { lessonController } = require('../../controllers');
const { subscribeAuthMiddleware } = require("../../middleware");
const {UserRoleEnum, useUnsubscribeCb} = require("../../utils");

const presentStudentsChanged = {
    type: new GraphQLList(new GraphQLNonNull(StudentType)),
    name: 'presentStudentsChanged',
    description: 'Present Students Changed',
    args: {
        //teacher or student id in token
        lessonId: {type: new GraphQLNonNull(GraphQLID)},
    },
    subscribe: async (parent, args, context) => await lessonController.presentStudentsChanged(args, context)
};

const studentAnswersChanged = {
    type: new GraphQLList(new GraphQLNonNull(TaskStudentsAnswersInterfaceType)),
    name: "studentAnswerChanged",
    description: "Student Answer Changed",
    args: {
        lessonId: {type: new GraphQLNonNull(GraphQLID)},
    },
    subscribe: async (parent, args, context) => await lessonController.studentAnswersChanged(args, context)
};

const lessonStatusChanged = {
    type: LessonStatusType,
    name: "lessonStatusChanged",
    description: "Lesson Status Changed",
    args: {
        lessonId: {type: new GraphQLNonNull(GraphQLID)},
    },
    subscribe: async (parent, args, context) => await lessonController.lessonStatusChanged(args, context)
}

const correctAnswersShown = {
    type: LessonCorrectAnswersType,
    name: 'correctAnswerShown',
    description: 'correct answer shown',
    args: {
        lessonId: { type: new GraphQLNonNull(GraphQLID) }
    },
    subscribe: async (parent, args, context) => await lessonController.correctAnswerShown(args, context)
}

const getStudentCurrentPosition = {
    type: new GraphQLNonNull(new GraphQLList(StudentCurrentTaskType)),
    name: 'getStudentCurrentPosition',
    description: 'Get Student Current Position',
    args: {
        lessonId: { type: new GraphQLNonNull(GraphQLID) }
    },
    subscribe: async (parent, args, context) => await lessonController.getStudentCurrentPosition(args, context)
}

const studentOnLesson = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'studentOnLesson',
    description: 'studentOnLesson',
    args: {
        lessonId: { type: new GraphQLNonNull(GraphQLID) },
    },
    subscribe: async (parent, args, context) => useUnsubscribeCb(
        await lessonController.studentOnLesson(args, context),
        () => lessonController.studentLeaveLesson(args, context)
    )
}

module.exports = {
    presentStudentsChanged: subscribeAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(presentStudentsChanged),
    studentAnswersChanged: subscribeAuthMiddleware(UserRoleEnum.TEACHER)(studentAnswersChanged),
    lessonStatusChanged,
    correctAnswersShown: subscribeAuthMiddleware(UserRoleEnum.STUDENT)(correctAnswersShown),
    getStudentCurrentPosition: subscribeAuthMiddleware(UserRoleEnum.TEACHER, UserRoleEnum.STUDENT)(getStudentCurrentPosition),
    studentOnLesson: subscribeAuthMiddleware(UserRoleEnum.STUDENT)(studentOnLesson),
};
