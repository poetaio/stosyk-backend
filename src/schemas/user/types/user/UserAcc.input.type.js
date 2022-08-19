const { GraphQLNonNull, GraphQLString, GraphQLInputObjectType, GraphQLEnumType} = require("graphql");
const UserRoleEnumType = require('./UserRoleEnum.type')

module.exports = new GraphQLInputObjectType({
    name: 'UserInputType',
    description: 'User Input type',
    fields: {
        role: {type: GraphQLNonNull(UserRoleEnumType)},
        name: {type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        avatar_source: {type: GraphQLNonNull(GraphQLString) }
    }
});
