const { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const { StudentAnswerType } = require('../option');


module.exports = new GraphQLObjectType({
    name: 'GapStudentAnswersType',
    description: 'Gap student answers type',
    fields: {
        gapId: { type: GraphQLNonNull(GraphQLID) },
        studentsAnswers: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentAnswerType))) }
    }
});
