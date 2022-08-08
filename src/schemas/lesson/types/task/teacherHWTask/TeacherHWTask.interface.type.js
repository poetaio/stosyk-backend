const {GraphQLInterfaceType} = require("graphql");
const {TaskTypeEnum} = require("../../../../../utils");
const teacherTaskInterfaceFields = require('./teacherHWTaskInterfaceFields');

module.exports = new GraphQLInterfaceType({
    name: 'TeacherHWTaskInterfaceType',
    description: 'Teacher Task Type',
    fields: () => teacherTaskInterfaceFields,
    resolveType: ({ type }, context, info) => {
        if (type === TaskTypeEnum.PLAIN_INPUT) {
            return 'PlainInputTeacherHWTaskType';
        } else if (type === TaskTypeEnum.MULTIPLE_CHOICE) {
            return 'MultipleChoiceTeacherHWTaskType';
        } else if (type === TaskTypeEnum.QA) {
            return 'QATeacherHWTaskType';
        } else if (type === TaskTypeEnum.MATCHING) {
            return 'MatchingTeacherHWTaskType';
        } else if (type === TaskTypeEnum.MEDIA) {
            return 'MediaTeacherHWTaskType';
        } else return null;
    },
});
