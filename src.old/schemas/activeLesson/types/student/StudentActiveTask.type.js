const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const StudentActiveGapType = require("./StudentActiveGap.type");


module.exports = new GraphQLObjectType({
    name: "StudentActiveTaskType",
    description: "Student active task",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        gaps: { type: GraphQLList(StudentActiveGapType) }
    })
});
