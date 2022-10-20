const { GraphQLObjectType, GraphQLNonNull, GraphQLList} = require("graphql");
const { SentenceStudentsAnswersType } = require('../../sentence');
const taskStudentsAnswersFields = require("./taskStudentsAnswersFields");
const TaskStudentsAnswersInterfaceType = require("./TaskStudentsAnswers.interface.type");
const {sentenceController} = require("../../../../../controllers");

module.exports = new GraphQLObjectType({
    name: 'MultipleChoiceTaskStudentAnswersType',
    description: 'Multiple Choice Task student answers type',
    fields: () => ({
        ...taskStudentsAnswersFields,
        sentences: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SentenceStudentsAnswersType))),
            resolve: async (parent, args, context) => await sentenceController.getAllWithStudentsAnswersByTaskId(parent),
        }
    }),
    interfaces: [TaskStudentsAnswersInterfaceType],
});
