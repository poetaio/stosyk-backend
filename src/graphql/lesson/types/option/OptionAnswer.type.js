const { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLObjectType, GraphQLBoolean} = require("graphql");


module.exports = new GraphQLObjectType({
    name: "OptionAnswerType",
    description: "Option Answer type",
    fields: {
        optionId: { type: new GraphQLNonNull(GraphQLID) },
        value: { type: new GraphQLNonNull(GraphQLString) },
    }
});
