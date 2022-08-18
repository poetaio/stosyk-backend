const { GraphQLNonNull, GraphQLString, GraphQLInputObjectType } = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: 'StudentInputType',
    description: 'Student Input type',
    fields: {
        name: {type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        avatar_source: {type: GraphQLNonNull(GraphQLString) }
    }
});
