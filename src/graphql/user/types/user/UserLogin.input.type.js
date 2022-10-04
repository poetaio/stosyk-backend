const { GraphQLNonNull, GraphQLString, GraphQLInputObjectType } = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: 'UserLoginInputType',
    description: 'User Login Input type',
    fields: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }
    }
});
