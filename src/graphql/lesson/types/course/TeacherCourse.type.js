const { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLObjectType, GraphQLBoolean, GraphQLList} = require("graphql");
const TeacherLessonType = require("../lesson/TeacherLesson.type");
const {lessonController, courseController} = require("../../../../controllers");
const StudentWithCourseResultsType = require("../../../user/types/student/StudentWithCourseResults.type");


module.exports = new GraphQLObjectType({
    name: "TeacherCourseType",
    description: "Course type",
    fields: () => ({
        courseId: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        lessons: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherLessonType))),
            resolve: async (parent, args, context) =>
                await lessonController.getLessonsByCourse(parent, args, context),
        },
        students: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentWithCourseResultsType))),
            resolve: async (parent, args, context) =>
                await courseController.getAllStudentsWhoTookLessons(parent),
        },
    }),
});
