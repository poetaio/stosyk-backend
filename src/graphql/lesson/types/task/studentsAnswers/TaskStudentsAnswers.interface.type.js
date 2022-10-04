const {GraphQLInterfaceType} = require("graphql");
const taskStudentsAnswersFields = require('./taskStudentsAnswersFields');
const {TaskTypeEnum} = require("../../../../../utils");

module.exports = new GraphQLInterfaceType({
    name: 'TaskStudentAnswersInterfaceType',
    description: 'Task student answers interface type',
    fields: {
        ...taskStudentsAnswersFields,
    },
    resolveType: ({ type }, context, info) => {
        if (type === TaskTypeEnum.PLAIN_INPUT) {
            return 'PlainInputTaskStudentAnswersType';
        } else if (type === TaskTypeEnum.MULTIPLE_CHOICE) {
            return 'MultipleChoiceTaskStudentAnswersType';
        } else if (type === TaskTypeEnum.MATCHING) {
            return 'MatchingTaskStudentsAnswersType';
        } else if (type === TaskTypeEnum.QA) {
            return 'QATaskStudentsAnswersType';
        } else if (type === TaskTypeEnum.MEDIA) {
            return 'MediaTaskStudentsAnswersType';
        } else return null;
    },
});
