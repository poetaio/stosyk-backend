const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLFloat} = require("graphql");
const {homeworkController} = require("../../../../controllers");

module. exports = new GraphQLObjectType({
    name: "StudentWithHWScoreType",
    description: "Student with completeness and correctness percentage",
    fields: {
        studentId: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        progress: {
            // value in percents
            type: GraphQLNonNull(GraphQLFloat),
            resolve: async (parent, args, context) =>
                await homeworkController.getStudentProgress(parent),
        },
        score: {
            // value in percents
            type: GraphQLFloat,
            resolve: async (parent, args, context) =>
                await homeworkController.getTotalScore(parent),
        },
    }
});
