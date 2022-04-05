const { GraphQLID } = require('graphql');
const lessonController = require('../../controllers/lessonController');
const { LessonType } = require('./lessonTypes');

const addLesson = {
    type: LessonType,
    description: "Add Lesson",
    args: {
        authorId: { type: GraphQLID }
    },
    resolve: async (parent, args) => await lessonController.add(args)
};

module.exports = {
    addLesson
};
