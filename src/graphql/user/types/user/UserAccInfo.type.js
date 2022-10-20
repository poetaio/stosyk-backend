const { GraphQLNonNull, GraphQLString, GraphQLObjectType} = require("graphql");
const UserRoleEnumType = require('./UserRoleEnum.type')


module.exports = new GraphQLObjectType({
    name: 'UserAccInfoType',
    description: 'User Account Info type',
    fields: {
        role: {type: new GraphQLNonNull(UserRoleEnumType)},
        name: {type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        avatar_source: {type: new GraphQLNonNull(GraphQLString) }
    }
});
