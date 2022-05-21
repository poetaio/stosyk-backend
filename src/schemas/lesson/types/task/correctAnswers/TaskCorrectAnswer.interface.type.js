const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLInterfaceType} = require("graphql");
const taskCorrectAnswersFields = require('./taskCorrectAnswerFields');
const {TaskTypeEnum, ValidationError} = require("../../../../../utils");

module.exports = new GraphQLInterfaceType({
    name: 'TaskCorrectAnswersInterfaceType',
    description: 'Task Correct Answers Interface Type',
    fields: () => taskCorrectAnswersFields,
        // multipleChoice: { type: MultipleChoiceTaskCorrectAnswerType },
        // plainInput: { type: PlainInputTaskCorrectAnswerType },
    resolveType: ({ type }, context, info) => {
        if (type === TaskTypeEnum.PLAIN_INPUT) {
            return 'PlainInputTaskCorrectAnswersType';
        } else if (type === TaskTypeEnum.MULTIPLE_CHOICE) {
            return 'MultipleChoiceTaskCorrectAnswersType';
        } else if (type === TaskTypeEnum.QA) {
            return 'QATaskCorrectAnswersType';
        } else if (type === TaskTypeEnum.MATCHING) {
            return 'MatchingTaskCorrectAnswersType';
        } else throw new ValidationError(`Unknown type: ${type}`);
    },
});
