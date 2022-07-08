const {GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLID, GraphQLObjectType} = require("graphql");
const {StudentOptionType} = require("../option");
const {optionController} = require("../../../../controllers");


module.exports = new GraphQLObjectType({
    name: 'MatchingStudentSentenceLeftType',
    description: 'MatchingStudentSentenceLeftType. Contains sentence info (id, index, text)',
    fields: {
        sentenceId: { type: GraphQLNonNull(GraphQLID) },
        index: { type: GraphQLNonNull(GraphQLInt) },
        text: { type: GraphQLNonNull(GraphQLString) },
        chosenOption: {
            type: StudentOptionType,
            resolve: async (parent, args, context) => await optionController.getMatchingChosenOptionBySentenceId(parent, context)
        }
    }
});
