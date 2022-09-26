const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLFloat, GraphQLList} = require("graphql");
const {courseController} = require("../../../../controllers");
const StudentLessonResultType = require("./StudentLessonResult.type");

module.exports = new GraphQLObjectType({
    name: "StudentWithCourseResultsType",
    description: "Student with completeness and correctness percentage for a course and its every lesson",
    fields: () => ({
        studentId: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        progress: {
            // value in percents
            type: GraphQLNonNull(GraphQLFloat),
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
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentLessonResultType))),
            resolve: async (parent, args, context) =>
                await courseController.getLessonsByCourseForStudent(parent),
        },
    }),
});
