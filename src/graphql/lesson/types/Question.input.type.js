const {GraphQLInputObjectType, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInt} = require("graphql");
const {OptionInputType} = require("./option");

module.exports = new GraphQLInputObjectType({
    name: "QuestionInputType",
    description: "Question Input Type",
    fields: {
        index: { type: new GraphQLNonNull(GraphQLInt) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        options: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(OptionInputType))) }
    },
});
