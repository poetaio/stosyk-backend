const { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLInt} = require("graphql");
const taskStudentsAnswersFields = require("./taskStudentsAnswersFields");
const TaskStudentsAnswersInterfaceType = require("./TaskStudentsAnswers.interface.type");
const QuestionStudentsAnswersType = require("../../QuestionStudentsAnswers.type");
const {sentenceController} = require("../../../../../controllers");

module.exports = new GraphQLObjectType({
    name: 'QATaskStudentsAnswersType',
    description: 'QATaskStudentsAnswersType. Contains questions and students answers each',
    fields: () => ({
        ...taskStudentsAnswersFields,
        questions: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(QuestionStudentsAnswersType))),
            // todo:
            resolve: async (parent, args, context) => sentenceController.getAllQA(parent)
        }
    }),
    interfaces: [TaskStudentsAnswersInterfaceType],
});
