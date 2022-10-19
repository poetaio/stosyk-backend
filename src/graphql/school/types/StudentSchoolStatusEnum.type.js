const { convertToGraphQLEnum, StudentSchoolStatusEnum} = require("../../../utils");
const { GraphQLEnumType } = require("graphql");

module.exports = new GraphQLEnumType({
    name: "StudentSchoolStatusEnumType",
    values: convertToGraphQLEnum(StudentSchoolStatusEnum)
});
