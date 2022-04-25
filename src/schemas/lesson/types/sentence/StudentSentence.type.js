const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLList} = require("graphql");
const { StudentGapType } = require("../gap");

module.exports = new GraphQLObjectType({
    name: "StudentSentenceType",
    description: "Student Sentence type",
    fields: {
        sentenceId: { type: GraphQLNonNull(GraphQLID) },
        text: { type: GraphQLNonNull(GraphQLString) },
        index: { type: GraphQLNonNull(GraphQLInt) },
        gaps: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentGapType))),
            // todo: add resolve
        }
    }
});
