const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList, GraphQLBoolean, GraphQLString} = require("graphql");
const TeacherActiveGapType = require('./TeacherActiveGap.type');


module.exports = new GraphQLObjectType({
    name: "TeacherActiveTaskType",
    description: "Active task type",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        gaps: { type: GraphQLList(TeacherActiveGapType) },
        text: { type: GraphQLNonNull(GraphQLString) }
    }
});
