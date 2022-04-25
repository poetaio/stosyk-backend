const {GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLList, GraphQLID} = require("graphql");
const { StudentSentenceType } = require("../sentence");

module.exports = new GraphQLObjectType({
    name: 'StudentTaskType',
    description: 'Student Task Type',
    fields: {
        taskId: { type: GraphQLNonNull(GraphQLID) },
        answersShown: { type: GraphQLNonNull(GraphQLBoolean) },
        sentences: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentSentenceType))),
            // todo: add resolve
        }
    }
});
