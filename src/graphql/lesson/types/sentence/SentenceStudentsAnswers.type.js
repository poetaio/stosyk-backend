const { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const { GapStudentsAnswersType } = require('../gap');


module.exports = new GraphQLObjectType({
    name: 'SentenceStudentAnswersType',
    description: 'Sentence student answers type',
    fields: {
        sentenceId: { type: new GraphQLNonNull(GraphQLID) },
        gaps: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GapStudentsAnswersType))) }
    }
});
