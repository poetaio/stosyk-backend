const { GraphQLNonNull, GraphQLString, GraphQLObjectType} = require("graphql");


module.exports = new GraphQLObjectType({
    name: 'UserAccInfoType',
    description: 'User Account Info type',
    fields: {
        name: {type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        avatar_source: {type: GraphQLNonNull(GraphQLString) }
    }
});
