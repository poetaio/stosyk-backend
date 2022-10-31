const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLFloat, GraphQLList} = require("graphql");
const {courseController} = require("../../../../controllers");
const StudentLessonResultType = require("./StudentLessonResult.type");

module.exports = new GraphQLObjectType({
    name: "StudentWithCourseResultsType",
    description: "Student with completeness and correctness percentage for a course and its every lesson",
    fields: () => ({
        studentId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        progress: {
            // value in percents
            type: GraphQLFloat,
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
