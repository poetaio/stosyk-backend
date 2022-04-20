const {GraphQLInputObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLString} = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: "OptionInputType",
    description: "Option input type",
    fields: {
        value: { type: GraphQLNonNull(GraphQLString) },
        isCorrect: { type: GraphQLNonNull(GraphQLBoolean) }
    }
});
