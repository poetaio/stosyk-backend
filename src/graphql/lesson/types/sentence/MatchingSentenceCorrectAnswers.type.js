const {GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID} = require("graphql");
const { GapCorrectAnswersType } = require('../gap');
const {StudentOptionType, MatchingTeacherOptionType} = require("../option");
const {optionController} = require("../../../../controllers");


module.exports = new GraphQLObjectType({
    name: 'MatchingSentenceCorrectAnswersType',
    description: 'Contains sentence id and matching option from right column',
    fields: {
        sentenceId: { type: GraphQLNonNull(GraphQLID) },
        matchingOption: {
            type: GraphQLNonNull(MatchingTeacherOptionType),
            resolve: async (parent, args, context) => await optionController.getMatchingCorrectOption(parent)
        },
    }
});
