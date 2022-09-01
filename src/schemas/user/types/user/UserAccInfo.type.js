const { GraphQLNonNull, GraphQLString, GraphQLObjectType} = require("graphql");
const UserRoleEnumType = require('./UserRoleEnum.type')


module.exports = new GraphQLObjectType({
    name: 'UserAccInfoType',
    description: 'User Account Info type',
    fields: {
        role: {type: GraphQLNonNull(UserRoleEnumType)},
        name: {type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        avatar_source: {type: GraphQLNonNull(GraphQLString) }
    }
});
