const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLList} = require("graphql");
const { StudentGapType } = require("../gap");
const {gapController} = require("../../../../controllers");

module.exports = new GraphQLObjectType({
    name: "StudentSentenceType",
    description: "Student Sentence type",
    fields: {
        sentenceId: { type: GraphQLNonNull(GraphQLID) },
        text: { type: GraphQLNonNull(GraphQLString) },
        index: { type: GraphQLNonNull(GraphQLInt) },
        gaps: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentGapType))),
            resolve: async (parent, args, context) =>
                await gapController.getGaps(parent, args, context)
        }
    }
});
