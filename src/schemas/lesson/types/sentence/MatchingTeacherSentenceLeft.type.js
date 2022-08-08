const {GraphQLInputObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLObjectType} = require("graphql");
const { GapInputType } = require('../gap');
const { MatchingTeacherOptionType, StudentAnswerType, OptionAnswerType} = require("../option");
const {optionController} = require("../../../../controllers");


module.exports = new GraphQLObjectType({
    name: 'MatchingTeacherSentenceLeftType',
    description: 'MatchingTeacherSentenceLeftType. Contains sentence info (id, index, text) and correct option',
    fields: {
        sentenceId: { type: GraphQLNonNull(GraphQLID) },
        index: { type: GraphQLNonNull(GraphQLInt) },
        text: { type: GraphQLNonNull(GraphQLString) },
        correctOption: {
            type: GraphQLNonNull(OptionAnswerType),
            resolve: async (parent, args, context) => await optionController.getMatchingCorrectOption(parent)
        },
        studentsAnswers: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentAnswerType))),
            resolve: async (parent, args, context) => await optionController.getMatchingStudentsAnswersBySentenceId(parent)
        },
    }
});
