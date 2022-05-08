const { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLObjectType, GraphQLBoolean} = require("graphql");


module.exports = new GraphQLObjectType({
    name: "OptionAnswerType",
    description: "Option Answer type",
    fields: {
        optionId: { type: GraphQLNonNull(GraphQLID) },
        value: { type: GraphQLNonNull(GraphQLString) },
        isCorrect: { type: GraphQLNonNull(GraphQLBoolean) }
    }
});
