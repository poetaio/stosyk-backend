const {GraphQLInputObjectType, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInt} = require("graphql");
const {OptionInputType} = require("./option");

module.exports = new GraphQLInputObjectType({
    name: "QuestionInputType",
    description: "Question Input Type",
    fields: {
        index: { type: GraphQLNonNull(GraphQLInt) },
        text: { type: GraphQLNonNull(GraphQLString) },
        options: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(OptionInputType))) }
    },
});
