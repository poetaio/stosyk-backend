const {GraphQLInterfaceType} = require("graphql");
const taskStudentsAnswersFields = require('./taskStudentsAnswersFields');
const {TaskTypeEnum} = require("../../../../../utils");

module.exports = new GraphQLInterfaceType({
    name: 'TaskStudentAnswersType',
    description: 'Task student answers type',
    fields: {
        ...taskStudentsAnswersFields,
    },
    resolveType: ({ type }, context, info) => {
        if (type === TaskTypeEnum.PLAIN_INPUT) {
            return 'PlainInputTaskStudentAnswersType';
        } else if (type === TaskTypeEnum.MULTIPLE_CHOICE) {
            return 'MultipleChoiceTaskStudentAnswersType';
        } else return null;
    },
});
