const {GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLID, GraphQLObjectType} = require("graphql");
const {StudentOptionType, MatchingTeacherOptionType} = require("../option");
const {optionController} = require("../../../../controllers");


module.exports = new GraphQLObjectType({
    name: 'MatchingStudentSentenceLeftType',
    description: 'MatchingStudentSentenceLeftType. Contains sentence info (id, index, text)',
    fields: {
        sentenceId: { type: new GraphQLNonNull(GraphQLID) },
        index: { type: new GraphQLNonNull(GraphQLInt) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        chosenOption: {
            type: StudentOptionType,
            resolve: async (parent, args, context) => await optionController.getMatchingChosenOptionBySentenceId(parent, context)
        },
        correctOption: {
            type: MatchingTeacherOptionType,
            resolve: async (parent, args, context) => await optionController.getMatchingCorrectOptionForStudent(parent)
        },
    }
});
