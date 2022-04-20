const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLBoolean, GraphQLString} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "TeacherShowedHidRightAnswerType",
    description: "Teacher Showed Hid Right Answer Type",
    fields: {
        taskId: { type: GraphQLNonNull(GraphQLID) },
        action: { type: GraphQLNonNull(GraphQLString) }
    }
});
