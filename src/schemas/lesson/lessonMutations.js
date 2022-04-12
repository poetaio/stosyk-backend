const { GraphQLID, GraphQLNonNull} = require('graphql');
const lessonController = require('../../controllers/lessonController');
const { LessonType } = require('./types');

const addLesson = {
    type: LessonType,
    description: "Add Lesson",
    args: {
        authorId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args) => await lessonController.add(args)
};

module.exports = {
    addLesson
};
