const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLList} = require("graphql");
const { TeacherGapType } = require("../gap");

module.exports = new GraphQLObjectType({
    name: "TeacherSentenceType",
    description: "Teacher Sentence type",
    fields: {
        sentenceId: { type: GraphQLNonNull(GraphQLID) },
        text: { type: GraphQLNonNull(GraphQLString) },
        index: { type: GraphQLNonNull(GraphQLInt) },
        gaps: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherGapType)))}
    }
});
