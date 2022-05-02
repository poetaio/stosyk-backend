const { convertToGraphQLEnum, TaskTypeEnum } = require("../../../../utils");
const { GraphQLEnumType } = require("graphql");

module.exports = new GraphQLEnumType({
    name: "TaskTypeEnumType",
    values: convertToGraphQLEnum(TaskTypeEnum)
});
