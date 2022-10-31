const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLID,
    GraphQLFloat
} = require("graphql");
const {homeworkController} = require("../../../../controllers");

module.exports = new GraphQLObjectType({
    name: "StudentHomeworkResultType",
    description: "Homework with results",
    fields: {
        homeworkId: { type: new GraphQLNonNull(GraphQLID) },
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
    },
});
