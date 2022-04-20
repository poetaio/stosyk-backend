const {GraphQLEnumType} = require("graphql");
const convertToGraphQLEnumValues = require('../../../utils/convertToGraphQLEnumValues');
const StudentAnswerSheetStatusEnum = require('../../../../models/lesson_active/utils/StudentAnswerSheetStatusEnum')

module.exports = new GraphQLEnumType({
    name: 'StudentAnswerSheetStatusEnumType',
    values: convertToGraphQLEnumValues(StudentAnswerSheetStatusEnum)
});
