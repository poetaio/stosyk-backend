const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt, GraphQLList} = require("graphql");
const { GapType } = require("../gap");

module.exports = new GraphQLObjectType({
    name: "SentenceType",
    description: "Sentence type",
    fields: {
        sentenceId: { type: GraphQLNonNull(GraphQLID) },
        text: { type: GraphQLNonNull(GraphQLString) },
        index: { type: GraphQLNonNull(GraphQLInt) },
        gaps: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GapType)))}
    }
});
