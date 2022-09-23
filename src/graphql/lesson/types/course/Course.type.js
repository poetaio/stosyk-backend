const { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLObjectType, GraphQLBoolean, GraphQLList} = require("graphql");
const {TeacherLessonType} = require("../lesson");
const {lessonController} = require("../../../../controllers");


module.exports = new GraphQLObjectType({
    name: "CourseType",
    description: "Course type",
    fields: {
        courseId: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        lessons: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherLessonType))),
            resolve: async (parent, args, context) =>
                await lessonController.getLessonsByCourse(parent, args, context)
        }
    },
});
