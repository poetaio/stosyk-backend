const {GraphQLObjectType, GraphQLNonNull, GraphQLString } = require("graphql");

module.exports = new GraphQLObjectType({
    name: "TokenType",
    description: "Token Type",
    fields: {
        token: { type: GraphQLNonNull(GraphQLString) }
    }
});
