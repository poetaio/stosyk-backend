const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLList} = require("graphql");
const { TeacherGapType } = require("../gap");
const { gapController, optionController} = require("../../../../controllers");
const {StudentAnswerType} = require("../option");

module.exports = new GraphQLObjectType({
    name: "TeacherSentenceType",
    description: "Teacher Sentence type",
    fields: {
        sentenceId: { type: new GraphQLNonNull(GraphQLID) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        index: { type: new GraphQLNonNull(GraphQLInt) },
        gaps: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TeacherGapType))),
            resolve: async (parent, args, context) =>
                await gapController.getGaps(parent, args, context)
        },
    }
});
