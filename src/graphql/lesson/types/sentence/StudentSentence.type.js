const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLList} = require("graphql");
const { StudentGapType } = require("../gap");
const {gapController} = require("../../../../controllers");

module.exports = new GraphQLObjectType({
    name: "StudentSentenceType",
    description: "Student Sentence type",
    fields: {
        sentenceId: { type: new GraphQLNonNull(GraphQLID) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        index: { type: new GraphQLNonNull(GraphQLInt) },
        gaps: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentGapType))),
            resolve: async (parent, args, context) =>
                await gapController.getGaps(parent, args, context)
        }
    }
});
