const {GraphQLInterfaceType, GraphQLNonNull, GraphQLList, GraphQLObjectType} = require("graphql");
const answerSheetTaskFields = require('./answerSheetTaskFields');
const AnswerSheetTaskInterfaceType = require("./AnswerSheetTask.interface.type");
const {PlainInputAnswerSheetSentenceType} = require("../../sentence");
const {sentenceController} = require("../../../../../controllers");

module.exports = new GraphQLObjectType({
    name: 'PlainInputAnswerSheetTaskType',
    description: 'Plain input answer sheet Task type',
    interfaces: [AnswerSheetTaskInterfaceType],
    fields: {
        ...answerSheetTaskFields,
        sentences: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(PlainInputAnswerSheetSentenceType))),
            resolve: async (parent, args, context) => await sentenceController.getAllWithAnswerSheetByTaskId(parent, context)
        }
    },
});
