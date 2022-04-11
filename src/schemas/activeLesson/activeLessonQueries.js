const {GraphQLID, GraphQLNonNull} = require("graphql");

const activeLessonController = require('../../controllers/activeLessonController');
const {TeacherActiveLessonType} = require("./types/index");


const teacherActiveLesson = {
    type: TeacherActiveLessonType,
    name: "activeLesson",
    description: "Get active lessons with tasks, sentences, options, student answers",
    args: {
        // todo: get id from token
        teacherId: { type: GraphQLNonNull(GraphQLID) },
        activeLessonId: { type: GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => await activeLessonController.getActiveLessonById(args)
};

module.exports = {
    teacherActiveLesson
};
