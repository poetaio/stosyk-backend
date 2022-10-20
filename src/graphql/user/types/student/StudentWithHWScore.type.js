const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLFloat} = require("graphql");
const {homeworkController} = require("../../../../controllers");

module.exports = new GraphQLObjectType({
    name: "StudentWithHWScoreType",
    description: "Student with completeness and correctness percentage for a homework",
    fields: {
        studentId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        progress: {
            // value in percents
            type: new GraphQLNonNull(GraphQLFloat),
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
