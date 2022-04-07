const { GraphQLID, GraphQLNonNull} = require('graphql')

const lessonController = require('../../controllers/lessonController');
const { LessonType, CountedLessonListType} = require("./lessonTypes");

const lessons = {
    type: CountedLessonListType,
    description: "Get All Lessons",
    args: {
        authorId: { type: GraphQLID }
    },
    resolve: async (parent, args) => await lessonController.getAll(args),
};

const lesson = {
    type: LessonType,
    description: "Get lesson by lesson id",
    args: {
        id: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args) => await lessonController.getOneById(args.id)
}

module.exports = {
    lessons,
    lesson
}
