const { convertToGraphQLEnum, SchoolInvitationStatusEnum} = require("../../../../utils");
const { GraphQLEnumType } = require("graphql");

module.exports = new GraphQLEnumType({
    name: "SchoolInvitationStatusEnumType",
    values: convertToGraphQLEnum(SchoolInvitationStatusEnum),
});
