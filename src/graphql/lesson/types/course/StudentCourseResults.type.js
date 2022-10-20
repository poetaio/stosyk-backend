const { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLObjectType, GraphQLBoolean, GraphQLList, GraphQLFloat} = require("graphql");
const TeacherLessonType = require("../lesson/TeacherLesson.type");
const {lessonController, courseController} = require("../../../../controllers");
const StudentWithCourseResultsType = require("../../../user/types/student/StudentWithCourseResults.type");
const StudentLessonResultType = require("../../../user/types/student/StudentLessonResult.type");


module.exports = new GraphQLObjectType({
    name: "SchoolCourseResultsType",
    description: "Course type",
    fields: () => ({
        courseId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        progress: {
            // value in percents
            type: new GraphQLNonNull(GraphQLFloat),
            resolve: async (parent, args, context) =>
                await courseController.getStudentProgress(parent),
        },
        score: {
            // value in percents
            type: GraphQLFloat,
            resolve: async (parent, args, context) =>
                await courseController.getTotalScore(parent),
        },
        lessonResults: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentLessonResultType))),
            resolve: async (parent, args, context) =>
                await courseController.getLessonsByCourseForStudent(parent),
        },
    }),
});
