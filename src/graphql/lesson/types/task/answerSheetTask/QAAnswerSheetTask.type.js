const {GraphQLInterfaceType, GraphQLNonNull, GraphQLList, GraphQLObjectType} = require("graphql");
const answerSheetTaskFields = require('./answerSheetTaskFields');
const AnswerSheetTaskInterfaceType = require("./AnswerSheetTask.interface.type");
const {sentenceController} = require("../../../../../controllers");
const AnswerSheetQuestionType = require("../../AnswerSheetQuestion.type");

module.exports = new GraphQLObjectType({
    name: 'QAAnswerSheetTaskType',
    description: 'QA answer sheet Task type',
    interfaces: [AnswerSheetTaskInterfaceType],
    fields: {
        ...answerSheetTaskFields,
        questions: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(AnswerSheetQuestionType))),
            resolve: async (parent, args, context) => await sentenceController.getAllQA(parent)
        }
    },
});
