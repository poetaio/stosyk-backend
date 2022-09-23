const { convertToGraphQLEnum, UserRoleEnum } = require("../../../../utils");
const { GraphQLEnumType } = require("graphql");

module.exports = new GraphQLEnumType({
    name: "UserRoleEnumType",
    values: convertToGraphQLEnum(UserRoleEnum)
});
