const { convertToGraphQLEnum, SchoolStudentSeatStatusEnum} = require("../../../../utils");
const { GraphQLEnumType } = require("graphql");

module.exports = new GraphQLEnumType({
    name: "SchoolStudentSeatStatusEnumType",
    values: convertToGraphQLEnum(SchoolStudentSeatStatusEnum)
});
