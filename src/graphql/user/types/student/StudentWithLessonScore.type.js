const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLFloat} = require("graphql");
const {homeworkController, lessonController} = require("../../../../controllers");

module.exports = new GraphQLObjectType({
    name: "StudentWithLessonScoreType",
    description: "Student with completeness and correctness percentage for a lesson",
    fields: {
        studentId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        progress: {
            // value in percents
            type: new GraphQLNonNull(GraphQLFloat),
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
