const {GraphQLInputObjectType, GraphQLList, GraphQLNonNull} = require("graphql");
const {SentenceInputType} = require("../../sentence");

module.exports = new GraphQLInputObjectType({
    name: "PlainInputTaskInputType",
    description: "Plain Input Task Input Type",
    fields: {
        sentences: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SentenceInputType)))},
    },
});
