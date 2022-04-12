const activeLessonController = require('../../controllers/activeLessonController');
const {GraphQLString, GraphQLNonNull, GraphQLID} = require("graphql");
const {EmptyType} = require("../types");
const { TeacherActiveLessonType, StudentJoinedLessonType } = require('./types');

/*
student

enter answer
join lesson
 */

/*
teacher

show answer

 */

const studentJoinLesson = {
    type: StudentJoinedLessonType,
    name: "studentJoinLesson",
    description: "Student join lesson by student id and active lesson id",
    // todo: move id to token
    args: {
        activeLessonId: { type: GraphQLNonNull(GraphQLID) },
        studentId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await activeLessonController.studentJoinLesson(args, context)
};

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

// publishes event 'studentChangedLesson'
const studentChange = {
    type: EmptyType,
    description: 'Publishes event "studentChangedLesson"',
    args: {
        studentId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await activeLessonController.studentChangedActiveLesson(args, context)
}

// publishes event 'teacherChangedLesson' because teacher has actually changed something, lol
const teacherChange = {
    type: EmptyType,
    description: 'Publishes event "teacherChangedLesson"',
    args: {
        teacherId: { type: GraphQLNonNull(GraphQLID) },
        teacherMessage: { type: GraphQLNonNull(GraphQLString) }
    },
    resolve: async (parent, args, context) => await activeLessonController.teacherChangedActiveLesson(args, context)
}

module.exports = {
    studentChange,
    teacherChange,
    studentJoinLesson,
    startActiveLesson,
    finishActiveLesson,
    resumeActiveLesson
};
