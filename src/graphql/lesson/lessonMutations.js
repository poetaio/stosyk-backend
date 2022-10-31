const {
    lessonController,
    taskController,
    courseController,
    homeworkController,
} = require('../../controllers');
const {
    LessonInputType,
    AnswerInputType,
    HomeworkInputType,
    HomeworkAnswerInputType,
    LessonEditInputType,
} = require('./types');
const {
    GraphQLBoolean,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
} = require("graphql");
const { resolveAuthMiddleware} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");
const {schoolService} = require("../../services/school");
const {schoolController} = require("../../controllers/school");


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
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'startLesson',
    description: 'Start Lesson',
    args: {
        lessonId: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.startLesson(args, context)
};

const finishLesson = {
    type: GraphQLBoolean,
    name: 'finishLesson',
    description: 'Finish Lesson',
    args: {
        lessonId: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.finishLesson(args, context)
};

const showAnswers = {
    type: GraphQLBoolean,
    name: 'showAnswers',
    description: 'Show Answers Of a task',
    args: {
        taskId: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await taskController.showAnswers(args, context)
}

const deleteLesson = {
    type: GraphQLBoolean,
    name: 'deleteLesson',
    description: 'Delete Lesson',
    args:{
        lessonId: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.deleteLesson(args, context)
}

const setAnswer = {
    type: GraphQLBoolean,
    name: 'setAnswer',
    description: 'Set Answer',
    args: {
        answer: { type: new GraphQLNonNull(AnswerInputType)}
    },
    resolve: async (parent, args, context) => await lessonController.setAnswer(args, context)
}

const setStudentCurrentPosition = {
    type: GraphQLBoolean,
    name: 'setStudentCurrentPosition',
    description: 'Set Student Current Position',
    args:{
        lessonId: { type: new GraphQLNonNull(GraphQLID) },
        taskId: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.setStudentCurrentPosition(args, context)
}

const createCourse = {
    type: new GraphQLNonNull(GraphQLID),
    name: 'createCourse',
    description: 'Create Course',
    args: {
        name: {type: new GraphQLNonNull(GraphQLString)}
        // todo: Add initial list of lessons or lesson ids
        // or even full lessons from scratch
    },
    resolve: async (parent, args, context) => await courseController.createCourse(args, context)
}

const addLessonToCourse = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'addLessonToCourse',
    description: 'Add Lesson to Course',
    args: {
        courseId: {type: new GraphQLNonNull(GraphQLID)},
        lessonId: {type: new GraphQLNonNull(GraphQLID)}
    },
    resolve: async  (parent, args, context) => await courseController.addLessonToCourse(args, context)
}

const removeLessonFromCourse = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'removeLessonFromCourse',
    description: 'Remove Lesson from Course',
    args:{
        courseId: {type: new GraphQLNonNull(GraphQLID)},
        lessonId: {type: new GraphQLNonNull(GraphQLID)}
    },
    resolve: async  (parent, args, context) => await courseController.removeLessonFromCourse(args, context)
}

const deleteCourse = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'deleteCourse',
    description: 'Delete Course',
    args: {
        courseId: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: async (parent, args, context) => await courseController.deleteCourse(args, context)
}

const renameCourse = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'renameCourse',
    description: 'Rename Course',
    args: {
        courseId: {type: new GraphQLNonNull(GraphQLID)},
        newName: {type: new GraphQLNonNull(GraphQLString)}
    },
    resolve: async (parent, args, context) => await courseController.renameCourse(args, context)
}


const addHomework = {
    type: new GraphQLNonNull(GraphQLID),
    name: 'addHomework',
    description: 'Add homework to lesson',
    args: {
        lessonId: { type: new GraphQLNonNull(GraphQLID) },
        homework: {type: new GraphQLNonNull(HomeworkInputType)},
    },
    resolve: async (parent, args, context) => await homeworkController.addHomeworkToLesson(args, context)
};

const setHomeworkAnswer = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'setHomeworkAnswer',
    description: 'Set homework answer',
    args: {
        answer: { type: new GraphQLNonNull(HomeworkAnswerInputType)}
    },
    resolve: async (parent, args, context) => await lessonController.setHomeworkAnswer(args, context)
}

const removeHomework = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'removeHomework',
    description: 'Remove homework from lesson',
    args: {
        lessonId: { type: new GraphQLNonNull(GraphQLID) },
        homeworkId: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: async (parent, args, context) => await homeworkController.removeFromLesson(args, context)
}

const deleteHomework = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'deleteHomework',
    description: 'Delete homework',
    args: {
        homeworkId: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: async (parent, args, context) => await homeworkController.delete(args, context)
}

const showHomeworkAnswers = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'ShowHomeworkAnswers',
    description: 'Show homework answers',
    args: {
        homeworkId: {type: new GraphQLNonNull(GraphQLID)},
    },
    resolve: async (parent, args, context) => await homeworkController.showAnswers(args, context)
}

const editLesson = {
    type: GraphQLBoolean,
    name: 'editLessonTasks',
    description: 'Edit lesson tasks',
    args: {
        lessonId: { type: new GraphQLNonNull(GraphQLID) },
        lesson: { type: LessonEditInputType }
    },
    resolve: async (parent, args, context) => await lessonController.editLesson(args, context)
}

const editHomework = {
    type: GraphQLBoolean,
    name: 'addHomework',
    description: 'Edit homework. Note that homeworkId will no longer be valid',
    args: {
        homeworkId: { type: new GraphQLNonNull(GraphQLID) },
        homework: {type: new GraphQLNonNull(HomeworkInputType)},
    },
    resolve: async (parent, args, context) => await homeworkController.editHomework(args, context)
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
    editLesson: resolveAuthMiddleware(UserRoleEnum.TEACHER)(editLesson),
    editHomework: resolveAuthMiddleware(UserRoleEnum.TEACHER)(editHomework),
    renameCourse: resolveAuthMiddleware(UserRoleEnum.TEACHER)(renameCourse),

    // student
    setAnswer: resolveAuthMiddleware(UserRoleEnum.STUDENT)(setAnswer),
    setStudentCurrentPosition: resolveAuthMiddleware(UserRoleEnum.STUDENT)(setStudentCurrentPosition),
    setHomeworkAnswer: resolveAuthMiddleware(UserRoleEnum.STUDENT)(setHomeworkAnswer),
};
