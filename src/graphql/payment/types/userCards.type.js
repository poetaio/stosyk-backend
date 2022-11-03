const {GraphQLString, GraphQLNonNull, GraphQLObjectType, GraphQLList} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "UserCardsType",
    description: "UserCardsType",
    fields: {
        cardTokens: {type: new GraphQLNonNull(new GraphQLList((GraphQLString)))},
        defaultCard: {type: new GraphQLNonNull(GraphQLString)}
    },
});
