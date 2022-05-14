const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLInterfaceType} = require("graphql");
const taskCorrectAnswersFields = require('./taskCorrectAnswerFields');
const {TaskTypeEnum} = require("../../../../../utils");

module.exports = new GraphQLInterfaceType({
    name: 'TaskCorrectAnswersType',
    description: 'Task Correct Answers Type',
    fields: () => taskCorrectAnswersFields,
        // multipleChoice: { type: MultipleChoiceTaskCorrectAnswerType },
        // plainInput: { type: PlainInputTaskCorrectAnswerType },
    resolveType: ({ type }, context, info) => {
        if (type === TaskTypeEnum.PLAIN_INPUT) {
            return 'PlainInputTaskStudentAnswersType';
        } else if (type === TaskTypeEnum.MULTIPLE_CHOICE) {
            return 'MultipleChoiceTaskStudentAnswersType';
        } else return null;
    },
});
