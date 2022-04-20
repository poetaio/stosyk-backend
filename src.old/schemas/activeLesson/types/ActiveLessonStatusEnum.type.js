const {GraphQLEnumType} = require("graphql");
const ActiveLessonStatusEnum = require("../../../models/lesson_active/utils/ActiveLessonStatusEnum");
const convertToGraphQLEnumValues = require('../../utils/convertToGraphQLEnumValues');

module.exports = new GraphQLEnumType({
    name: "ActiveLessonStatusEnum",
    values: convertToGraphQLEnumValues(ActiveLessonStatusEnum)
});
