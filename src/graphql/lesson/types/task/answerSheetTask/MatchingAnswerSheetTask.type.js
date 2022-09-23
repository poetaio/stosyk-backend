const {GraphQLInterfaceType, GraphQLNonNull, GraphQLList, GraphQLObjectType} = require("graphql");
const answerSheetTaskFields = require('./answerSheetTaskFields');
const AnswerSheetTaskInterfaceType = require("./AnswerSheetTask.interface.type");
const {MatchingAnswerSheetSentenceType} = require("../../sentence");
const {sentenceController} = require("../../../../../controllers");

module.exports = new GraphQLObjectType({
    name: 'MatchingAnswerSheetTaskType',
    description: 'Matching answer sheet Task type',
    interfaces: [AnswerSheetTaskInterfaceType],
    fields: {
        ...answerSheetTaskFields,
        leftColumn: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MatchingAnswerSheetSentenceType))),
            resolve: async (parent, args, context) => await sentenceController.getAllMatchingLeft(parent)
        }
    },
});
