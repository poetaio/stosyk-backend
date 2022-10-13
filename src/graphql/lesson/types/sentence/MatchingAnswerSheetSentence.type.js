const {GraphQLNonNull, GraphQLObjectType, GraphQLID} = require("graphql");
const {StudentOptionType} = require("../option");
const {optionController} = require("../../../../controllers");

module.exports = new GraphQLObjectType({
    name: "MatchingAnswerSheetSentenceType",
    description: "Right column sentence that contains specific student chosen option from the right column",
    fields: {
        sentenceId: { type: new GraphQLNonNull(GraphQLID) },
        chosenOption: {
            type: StudentOptionType,
            resolve: async (parent, args, context) => await optionController.getMatchingChosenOptionBySentenceId(parent, context)
        }
    },
});
