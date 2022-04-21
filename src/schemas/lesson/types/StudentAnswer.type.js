const { GraphQLObjectType, GraphQLNonNull, GraphQLID } = require("graphql");

module.exports = new GraphQLObjectType({
    name: 'StudentAnswerType',
    description: 'Student answer type',
    fields: {
        studentId: { type: GraphQLNonNull(GraphQLID) },
        optionId: { type: GraphQLNonNull(GraphQLID) }
    }
});
