const {GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLList, GraphQLID} = require("graphql");
const { SentenceType } = require("../sentence");

module.exports = new GraphQLObjectType({
    name: 'TaskType',
    description: 'Task Type',
    fields: {
        taskId: { type: GraphQLNonNull(GraphQLID) },
        answerShown: { type: GraphQLNonNull(GraphQLBoolean) },
        sentences: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SentenceType)))}
    }
});
