const { GraphQLNonNull, GraphQLID, GraphQLInputObjectType } = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: "ChangeStudentAnswerType",
    description: "Changes student answer",
    fields: {
        taskId: { type: GraphQLNonNull(GraphQLID) },
        sentenceId: { type: GraphQLNonNull(GraphQLID) },
        gapId: { type: GraphQLNonNull(GraphQLID) },
        optionId: { type: GraphQLNonNull(GraphQLID) }
    }
});
