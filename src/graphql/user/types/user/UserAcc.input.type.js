const { GraphQLNonNull, GraphQLString, GraphQLInputObjectType, GraphQLBoolean} = require("graphql");
const UserRoleEnumType = require('./UserRoleEnum.type')

module.exports = new GraphQLInputObjectType({
    name: 'UserInputType',
    description: 'User Input type',
    fields: {
        role: {type: new GraphQLNonNull(UserRoleEnumType)},
        name: {type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        avatar_source: {type: new GraphQLNonNull(GraphQLString) },
        ...(process.env.ENVIRONMENT === "DEV" && {automatic_verification: {type: GraphQLBoolean}})
    }
});
