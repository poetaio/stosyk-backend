const {GraphQLString, GraphQLNonNull, GraphQLObjectType, GraphQLID, GraphQLList} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "UserCardsType",
    description: "UserCardsType",
    fields: {
        cardTokens: {type: GraphQLNonNull(GraphQLList((GraphQLString)))},
        defaultCard: {type: GraphQLNonNull(GraphQLString)}
    },
});
