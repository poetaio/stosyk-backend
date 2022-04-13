const {GraphQLID, GraphQLNonNull, GraphQLBoolean} = require("graphql");

const activeLessonController = require('../../controllers/activeLessonController');
const {TeacherActiveLessonType} = require("./types/index");


const isLessonActive = {
    type: GraphQLBoolean,
    name: "isLessonActive",
    args: {
        activeLessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await activeLessonController.isLessonActive(args)
};

const teacherActiveLesson = {
    type: TeacherActiveLessonType,
    name: "teacherActiveLesson",
    description: "Get active lessons with tasks, sentences, options, student answers",
    args: {
        // todo: get id from token
        teacherId: { type: GraphQLNonNull(GraphQLID) },
        activeLessonId: { type: GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => await activeLessonController.getActiveLessonByIdForTeacher(args)
};

module.exports = {
    teacherActiveLesson,
    isLessonActive
};
