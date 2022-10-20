const {GraphQLInterfaceType, GraphQLNonNull, GraphQLList, GraphQLObjectType} = require("graphql");
const answerSheetTaskFields = require('./answerSheetTaskFields');
const AnswerSheetTaskInterfaceType = require("./AnswerSheetTask.interface.type");
const {MultipleChoiceAnswerSheetSentenceType} = require("../../sentence");
const {sentenceController} = require("../../../../../controllers");

module.exports = new GraphQLObjectType({
    name: 'MultipleChoiceAnswerSheetTaskType',
    description: 'Multiple choice answer sheet Task interface type',
    interfaces: [AnswerSheetTaskInterfaceType],
    fields: {
        ...answerSheetTaskFields,
        sentences: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MultipleChoiceAnswerSheetSentenceType))),
            resolve: async (parent, args, context) => await sentenceController.getAllWithAnswerSheetByTaskId(parent, context)
        }
    },
});
