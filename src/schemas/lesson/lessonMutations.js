const { lessonController, taskController, courseController} = require('../../controllers');
const { LessonInputType, AnswerInputType} = require('./types');
const { GraphQLBoolean, GraphQLID, GraphQLNonNull, GraphQLString} = require("graphql");
const { resolveAuthMiddleware} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");


const createLesson = {
    type: GraphQLID,
    name: 'createLesson',
    description: 'Create lesson',
    args: {
        lesson: { type: LessonInputType }
    },
    resolve: async (parent, args, context) => await lessonController.createLesson(args, context)
};

const startLesson = {
    type: GraphQLBoolean,
    name: 'startLesson',
    description: 'Start Lesson',
    args: {
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.startLesson(args, context)
};

const finishLesson = {
    type: GraphQLBoolean,
    name: 'finishLesson',
    description: 'Finish Lesson',
    args: {
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.finishLesson(args, context)
};

const showAnswers = {
    type: GraphQLBoolean,
    name: 'showAnswers',
    description: 'Show Answers Of a task',
    args: {
        taskId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await taskController.showAnswers(args, context)
}

const deleteLesson = {
    type: GraphQLBoolean,
    name: 'deleteLesson',
    description: 'Delete Lesson',
    args:{
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.deleteLesson(args, context)
}

const joinLesson = {
    type: GraphQLBoolean,
    name: 'joinLesson',
    description: 'Join Lesson',
    args:{
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.joinLesson(args, context)

}

const setAnswer = {
    type: GraphQLBoolean,
    name: 'setAnswer',
    description: 'Set Answer',
    args: {
        answer: { type: GraphQLNonNull(AnswerInputType)}
    },
    resolve: async (parent, args, context) => await lessonController.setAnswer(args, context)
}

const setStudentCurrentPosition = {
    type: GraphQLBoolean,
    name: 'setStudentCurrentPosition',
    description: 'Set Student Current Position',
    args:{
        lessonId: { type: GraphQLNonNull(GraphQLID) },
        taskId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.setStudentCurrentPosition(args, context)
}

const studentLeaveLesson = {
    type: GraphQLBoolean,
    name: 'studentLeaveLesson',
    description: 'Student Leave Lesson',
    args: {
        lessonId: {type: GraphQLNonNull(GraphQLID)}
    },
    resolve: async  (parent, args, context) => await lessonController.studentLeaveLesson(args, context)
}

const createCourse = {
    type: GraphQLNonNull(GraphQLID),
    name: 'createCourse',
    description: 'Create Course',
    args: {
        name: {type: GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await courseController.createCourse(args, context)
}

const addLessonToCourse = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'addLessonToCourse',
    description: 'Add Lesson to Course',
    args: {
        courseId: {type: GraphQLNonNull(GraphQLID)},
        lessonId: {type: GraphQLNonNull(GraphQLID)}
    },
    resolve: async  (parent, args, context) => await courseController.addLessonToCourse(args, context)
}


module.exports = {
    // teacher
    createLesson: resolveAuthMiddleware(UserRoleEnum.TEACHER)(createLesson),
    startLesson: resolveAuthMiddleware(UserRoleEnum.TEACHER)(startLesson),
    finishLesson: resolveAuthMiddleware(UserRoleEnum.TEACHER)(finishLesson),
    showAnswers: resolveAuthMiddleware(UserRoleEnum.TEACHER)(showAnswers),
    deleteLesson: resolveAuthMiddleware(UserRoleEnum.TEACHER)(deleteLesson),
    createCourse: resolveAuthMiddleware(UserRoleEnum.TEACHER)(createCourse),
    addLessonToCourse: resolveAuthMiddleware(UserRoleEnum.TEACHER)(addLessonToCourse),

    // student
    joinLesson: resolveAuthMiddleware(UserRoleEnum.STUDENT)(joinLesson),
    setAnswer: resolveAuthMiddleware(UserRoleEnum.STUDENT)(setAnswer),
    setStudentCurrentPosition: resolveAuthMiddleware(UserRoleEnum.STUDENT)(setStudentCurrentPosition),
    studentLeaveLesson: resolveAuthMiddleware(UserRoleEnum.STUDENT)(studentLeaveLesson),
};
