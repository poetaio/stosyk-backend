const { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const { SentenceStudentsAnswersType } = require('../sentence');


module.exports = new GraphQLObjectType({
    name: 'TaskStudentAnswersType',
    description: 'Task student answers type',
    fields: {
        taskId: { type: GraphQLNonNull(GraphQLID) },
        sentences: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SentenceStudentsAnswersType))) }
    }
});
