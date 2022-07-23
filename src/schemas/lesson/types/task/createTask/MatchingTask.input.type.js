const {GraphQLInputObjectType, GraphQLList, GraphQLNonNull} = require("graphql");
const {MatchingSentenceInputType} = require("../../sentence");

module.exports = new GraphQLInputObjectType({
    name: "MatchingTaskInputType",
    description: "MatchingTaskInputType. Contains left part of matching with right option from the right part for each sentence",
    fields: () => ({
        sentences: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MatchingSentenceInputType)))},
    }),
});
