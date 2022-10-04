const { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const { GapStudentsAnswersType } = require('../gap');


module.exports = new GraphQLObjectType({
    name: 'SentenceStudentAnswersType',
    description: 'Sentence student answers type',
    fields: {
        sentenceId: { type: GraphQLNonNull(GraphQLID) },
        gaps: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GapStudentsAnswersType))) }
    }
});
