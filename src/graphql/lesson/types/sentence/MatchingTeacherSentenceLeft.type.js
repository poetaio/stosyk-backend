const {GraphQLInputObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLObjectType} = require("graphql");
const { GapInputType } = require('../gap');
const { MatchingTeacherOptionType, StudentAnswerType} = require("../option");
const {optionController} = require("../../../../controllers");


module.exports = new GraphQLObjectType({
    name: 'MatchingTeacherSentenceLeftType',
    description: 'MatchingTeacherSentenceLeftType. Contains sentence info (id, index, text) and correct option',
    fields: {
        sentenceId: { type: new GraphQLNonNull(GraphQLID) },
        index: { type: new GraphQLNonNull(GraphQLInt) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        correctOption: {
            type: new GraphQLNonNull(MatchingTeacherOptionType),
            resolve: async (parent, args, context) => await optionController.getMatchingCorrectOption(parent)
        },
        studentsAnswers: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentAnswerType))),
            resolve: async (parent, args, context) => await optionController.getMatchingStudentsAnswersBySentenceId(parent)
        },
    }
});
