const {GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLID, GraphQLObjectType} = require("graphql");


module.exports = new GraphQLObjectType({
    name: 'MatchingStudentSentenceLeftType',
    description: 'MatchingStudentSentenceLeftType. Contains sentence info (id, index, text)',
    fields: {
        sentenceId: { type: GraphQLNonNull(GraphQLID) },
        index: { type: GraphQLNonNull(GraphQLInt) },
        text: { type: GraphQLNonNull(GraphQLString) },
    }
});
