const { lessonController, taskController, courseController, homeworkController} = require('../../controllers');
const { LessonInputType, AnswerInputType, HomeworkInputType, HomeworkAnswerInputType} = require('./types');
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
        // todo: Add initial list of lessons or lesson ids
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

const removeLessonFromCourse = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'removeLessonFromCourse',
    description: 'Remove Lesson from Course',
    args:{
        courseId: {type: GraphQLNonNull(GraphQLID)},
        lessonId: {type: GraphQLNonNull(GraphQLID)}
    },
    resolve: async  (parent, args, context) => await courseController.removeLessonFromCourse(args, context)
}

const deleteCourse = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'deleteCourse',
    description: 'Delete Course',
    args: {
        courseId: {type: GraphQLNonNull(GraphQLID)},
    },
    resolve: async (parent, args, context) => await courseController.deleteCourse(args, context)
}

const renameCourse = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'renameCourse',
    description: 'Rename Course',
    args: {
        courseId: {type: GraphQLNonNull(GraphQLID)},
        newName: {type: GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await courseController.renameCourse(args, context)
}


const addHomework = {
    type: GraphQLNonNull(GraphQLID),
    name: 'addHomework',
    description: 'Add homework to lesson',
    args: {
        lessonId: { type: GraphQLNonNull(GraphQLID) },
        homework: {type: GraphQLNonNull(HomeworkInputType)},
    },
    resolve: async (parent, args, context) => await homeworkController.addHomeworkToLesson(args, context)
};

const setHomeworkAnswer = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'setHomeworkAnswer',
    description: 'Set homework answer',
    args: {
        answer: { type: GraphQLNonNull(HomeworkAnswerInputType)}
    },
    resolve: async (parent, args, context) => await lessonController.setHomeworkAnswer(args, context)
}

const removeHomework = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'removeHomework',
    description: 'Remove homework from lesson',
    args: {
        lessonId: { type: GraphQLNonNull(GraphQLID) },
        homeworkId: {type: GraphQLNonNull(GraphQLID)},
    },
    resolve: async (parent, args, context) => await homeworkController.removeFromLesson(args, context)
}

const deleteHomework = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'deleteHomework',
    description: 'Delete homework',
    args: {
        homeworkId: {type: GraphQLNonNull(GraphQLID)},
    },
    resolve: async (parent, args, context) => await homeworkController.delete(args, context)
}

const showHomeworkAnswers = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'ShowHomeworkAnswers',
    description: 'Show homework answers',
    args: {
        homeworkId: {type: GraphQLNonNull(GraphQLID)},
    },
    resolve: async (parent, args, context) => await homeworkController.showAnswers(args, context)
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
    removeLessonFromCourse: resolveAuthMiddleware(UserRoleEnum.TEACHER)(removeLessonFromCourse),
    deleteCourse: resolveAuthMiddleware(UserRoleEnum.TEACHER)(deleteCourse),
    addHomework: resolveAuthMiddleware(UserRoleEnum.TEACHER)(addHomework),
    removeHomework: resolveAuthMiddleware(UserRoleEnum.TEACHER)(removeHomework),
    deleteHomework: resolveAuthMiddleware(UserRoleEnum.TEACHER)(deleteHomework),
    showHomeworkAnswers: resolveAuthMiddleware(UserRoleEnum.TEACHER)(showHomeworkAnswers),
    renameCourse: resolveAuthMiddleware(UserRoleEnum.TEACHER)(renameCourse),

    // student
    setAnswer: resolveAuthMiddleware(UserRoleEnum.STUDENT)(setAnswer),
    setStudentCurrentPosition: resolveAuthMiddleware(UserRoleEnum.STUDENT)(setStudentCurrentPosition),
    setHomeworkAnswer: resolveAuthMiddleware(UserRoleEnum.STUDENT)(setHomeworkAnswer),
};
