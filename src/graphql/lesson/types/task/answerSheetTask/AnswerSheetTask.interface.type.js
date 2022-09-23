const {GraphQLInterfaceType} = require("graphql");
const answerSheetTaskFields = require('./answerSheetTaskFields');
const {TaskTypeEnum, ValidationError} = require("../../../../../utils");

module.exports = new GraphQLInterfaceType({
    name: 'AnswerSheetTaskInterfaceType',
    description: 'Answer Sheet Task interface type',
    fields: {
        ...answerSheetTaskFields,
    },
    resolveType: ({ type }, context, info) => {
        if (type === TaskTypeEnum.PLAIN_INPUT) {
            return 'PlainInputAnswerSheetTaskType';
        } else if (type === TaskTypeEnum.MULTIPLE_CHOICE) {
            return 'MultipleChoiceAnswerSheetTaskType';
        } else if (type === TaskTypeEnum.MATCHING) {
            return 'MatchingAnswerSheetTaskType';
        } else if (type === TaskTypeEnum.QA) {
            return 'QAAnswerSheetTaskType';
        } else if (type === TaskTypeEnum.MEDIA) {
            return 'MediaAnswerSheetTaskType';
        } else throw new ValidationError(`Unknown task type: ${type}`);
    },
});
