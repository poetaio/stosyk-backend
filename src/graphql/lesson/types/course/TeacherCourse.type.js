const { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLObjectType, GraphQLBoolean, GraphQLList} = require("graphql");
const TeacherLessonType = require("../lesson/TeacherLesson.type");
const {lessonController, courseController} = require("../../../../controllers");
const StudentWithCourseResultsType = require("../../../user/types/student/StudentWithCourseResults.type");


module.exports = new GraphQLObjectType({
    name: "TeacherCourseType",
    description: "Course type",
    fields: () => ({
        courseId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        lessons: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TeacherLessonType))),
            resolve: async (parent, args, context) =>
                await lessonController.getLessonsByCourse(parent, args, context),
        },
        students: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentWithCourseResultsType))),
            resolve: async (parent, args, context) =>
                await courseController.getAllStudentsWhoTookLessons(parent),
        },
    }),
});
