const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLFloat} = require("graphql");
const {homeworkController, lessonController} = require("../../../../controllers");

module.exports = new GraphQLObjectType({
    name: "StudentWithLessonScoreType",
    description: "Student with completeness and correctness percentage for a lesson",
    fields: {
        studentId: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        progress: {
            // value in percents
            type: GraphQLNonNull(GraphQLFloat),
            resolve: async (parent, args, context) =>
                await lessonController.getStudentProgress(parent),
        },
        score: {
            // value in percents
            type: GraphQLFloat,
            resolve: async (parent, args, context) =>
                await lessonController.getTotalScore(parent),
        },
    }
});
