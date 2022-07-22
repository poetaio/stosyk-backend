const {GraphQLInterfaceType} = require("graphql");
const { TaskTypeEnum } = require('../../../../../utils');
const studentTaskInterfaceTypeFields = require('./studentTaskInterfaceFields');

module.exports = new GraphQLInterfaceType({
    name: 'StudentTaskType',
    description: 'Student Task Type',
    fields: () => studentTaskInterfaceTypeFields,
        // multipleChoice: { type: StudentTaskMultipleChoiceType },
        // plainInput: { type: StudentTaskPlainInputType },
    resolveType: ({ type }, context, info) => {
        if (type === TaskTypeEnum.PLAIN_INPUT) {
            return 'PlainInputStudentTaskType';
        } else if (type === TaskTypeEnum.MULTIPLE_CHOICE) {
            return 'MultipleChoiceStudentTaskType';
        } else if (type === TaskTypeEnum.MATCHING) {
            return 'MatchingStudentTaskType';
        } else if (type === TaskTypeEnum.QA) {
            return 'QAStudentTaskType';
        } else if (type === TaskTypeEnum.MEDIA) {
            return 'MediaStudentTaskType';
        } else return null;
    },
});
