const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLList} = require("graphql");
const { TeacherGapType } = require("../gap");
const { gapController } = require("../../../../controllers");

module.exports = new GraphQLObjectType({
    name: "TeacherSentenceType",
    description: "Teacher Sentence type",
    fields: {
        sentenceId: { type: GraphQLNonNull(GraphQLID) },
        text: { type: GraphQLNonNull(GraphQLString) },
        index: { type: GraphQLNonNull(GraphQLInt) },
        gaps: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherGapType))),
            resolve: async (parent, args, context) =>
                await gapController.getGaps(parent, args, context)
        }
    }
});
