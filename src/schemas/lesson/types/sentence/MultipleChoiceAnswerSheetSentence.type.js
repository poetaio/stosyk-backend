const { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const { GapStudentsAnswersType } = require('../gap');


module.exports = new GraphQLObjectType({
    name: 'MultipleChoiceAnswerSheetSentenceType',
    description: 'Multiple Choice Answer Sheet Sentence Type',
    fields: {
        sentenceId: { type: GraphQLNonNull(GraphQLID) },
        gaps: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GapStudentsAnswersType))) }
    }
});

