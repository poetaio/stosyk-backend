const { GraphQLID, GraphQLNonNull, GraphQLBoolean, GraphQLList} = require('graphql');
const lessonController = require('../../controllers/lessonController');
const { LessonType, TaskCreateType } = require('./types');

const addLesson = {
    type: LessonType,
    description: "Add Lesson",
    args: {
        authorId: { type: GraphQLNonNull(GraphQLID) },
        tasks: { type: GraphQLList(GraphQLNonNull(TaskCreateType)) }
    },
    resolve: async (parent, args) => await lessonController.add(args)
};

const deleteLesson = {
    type: GraphQLBoolean,
    description: "Delete Lesson",
    args: {
        authorId: { type: GraphQLNonNull(GraphQLID) },
        lessonId: { type: GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args) => await lessonController.deleteOne(args)
}

module.exports = {
    addLesson,
    deleteLesson
};
