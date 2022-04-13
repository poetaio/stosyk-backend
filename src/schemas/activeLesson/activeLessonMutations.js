const activeLessonController = require('../../controllers/activeLessonController');
const {GraphQLString, GraphQLNonNull, GraphQLID, GraphQLBoolean} = require("graphql");
const {EmptyType} = require("../types");
const { TeacherActiveLessonType, StudentJoinedLessonType, ChangeStudentAnswerType } = require('./types');
const {StudentActiveOptionType} = require("./types/student");

/*
student

enter answer
join lesson
 */

/*
teacher

show answer

 */

const createActiveLesson = {
    type: TeacherActiveLessonType,
    description: "Creates new active lesson from lesson markup",
    args: {
        // todo: get id to token
        teacherId: { type: GraphQLNonNull(GraphQLID) },
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args) => activeLessonController.createActiveLesson(args)
}

const startActiveLesson = {
    type: TeacherActiveLessonType,
    name: "startActiveLesson",
    description: "Start active lesson",
    // todo: move id to token
    args: {
        teacherId: { type: GraphQLNonNull(GraphQLID) },
        activeLessonId: { type: GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => await activeLessonController.startActiveLesson(args, context)
};

const finishActiveLesson = {
    type: TeacherActiveLessonType,
    name: "finishActiveLesson",
    description: "Start active lesson",
    // todo: move id to token
    args: {
        teacherId: { type: GraphQLNonNull(GraphQLID) },
        activeLessonId: { type: GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => await activeLessonController.finishActiveLesson(args, context)
};

const resumeActiveLesson = {
    type: TeacherActiveLessonType,
    name: "resumeActiveLesson",
    description: "Resume active lesson",
    // todo: move id to token
    args: {
        teacherId: { type: GraphQLNonNull(GraphQLID) },
        activeLessonId: { type: GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => await activeLessonController.resumeActiveLesson(args, context)
};

const studentJoinLesson = {
    type: StudentJoinedLessonType,
    name: "studentJoinLesson",
    description: "Student join lesson by student id and active lesson id",
    // todo: get id to token
    args: {
        activeLessonId: { type: GraphQLNonNull(GraphQLID) },
        studentId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await activeLessonController.studentJoinLesson(args, context)
};

const changeStudentAnswer = {
    type: GraphQLNonNull(StudentActiveOptionType),
    name: "changeStudentAnswer",
    description: "Student enters/changes answer",
    args: {
        // todo: get id from token
        studentId: { type: GraphQLNonNull(GraphQLID) },
        lessonId: { type: GraphQLNonNull(GraphQLID) },
        answer: { type: GraphQLNonNull(ChangeStudentAnswerType) },
    },
    resolve: async (parent, args, context) => await activeLessonController.changeStudentAnswer(args, context)
}

const showTaskRightAnswers = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: "showTaskRightAnswers",
    description: "showTaskRightAnswers",
    args: {
        teacherId: { type: GraphQLNonNull(GraphQLID) },
        activeLessonId: { type: GraphQLNonNull(GraphQLID) },
        taskId: { type: GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => await activeLessonController.showTaskRightAnswers(args, context)
}

const hideTaskRightAnswers = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: "hideTaskRightAnswers",
    description: "hideTaskRightAnswers",
    args: {
        teacherId: { type: GraphQLNonNull(GraphQLID) },
        activeLessonId: { type: GraphQLNonNull(GraphQLID) },
        taskId: { type: GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => await activeLessonController.hideTaskRightAnswers(args, context)
}


module.exports = {
    createActiveLesson,
    studentJoinLesson,
    startActiveLesson,
    finishActiveLesson,
    resumeActiveLesson,
    changeStudentAnswer,
    showTaskRightAnswers,
    hideTaskRightAnswers
};
