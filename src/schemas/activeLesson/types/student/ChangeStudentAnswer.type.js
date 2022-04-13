const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLInputObjectType} = require("graphql");


module.exports = new GraphQLInputObjectType({
    // studentId, lessonId, taskId, gapId, optionId
    name: "ChangeStudentAnswerType",
    description: "Changes student answer",
    fields: {
        lessonId: {type: GraphQLNonNull(GraphQLID)},
        taskId: {type: GraphQLNonNull(GraphQLID)},
        gapId: {type: GraphQLNonNull(GraphQLID)}
    }
});
