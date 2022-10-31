const { GraphQLNonNull, GraphQLString, GraphQLObjectType, GraphQLBoolean} = require("graphql");
const UserRoleEnumType = require('./UserRoleEnum.type')


module.exports = new GraphQLObjectType({
    name: 'UserAccInfoType',
    description: 'User Account Info type',
    fields: {
        role: {type: new GraphQLNonNull(UserRoleEnumType)},
        name: {type:  GraphQLString },
        email: { type:  GraphQLString },
        avatar_source: {type:  GraphQLString },
        registered: { type: new GraphQLNonNull(GraphQLBoolean) }
    }
});
