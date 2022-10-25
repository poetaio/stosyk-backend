const {GraphQLNonNull, GraphQLString, GraphQLInputObjectType} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "UserProfileInputType",
    description: "User Profile type",
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        avatar_url: { type:  new GraphQLNonNull(GraphQLString) },
    }
});