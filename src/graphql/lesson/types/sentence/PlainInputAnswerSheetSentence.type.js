const { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const { GapStudentsAnswersType } = require('../gap');


module.exports = new GraphQLObjectType({
    name: 'PlainInputAnswerSheetSentenceType',
    description: 'Plain Input Answer Sheet Sentence Type',
    fields: {
        sentenceId: { type: GraphQLNonNull(GraphQLID) },
        gaps: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GapStudentsAnswersType))) }
    }
});

