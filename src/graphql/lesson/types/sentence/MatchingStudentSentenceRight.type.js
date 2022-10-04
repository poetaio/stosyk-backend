const {GraphQLNonNull, GraphQLString, GraphQLID, GraphQLObjectType} = require("graphql");


module.exports = new GraphQLObjectType({
    name: 'MatchingStudentSentenceRightType',
    description: 'MatchingStudentSentenceRightType. Contains id and value',
    fields: {
        optionId: { type: GraphQLNonNull(GraphQLID) },
        value: { type: GraphQLNonNull(GraphQLString) },
    }
});
