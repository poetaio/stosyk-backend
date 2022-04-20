const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList, GraphQLString} = require("graphql");
const GapType = require('./Gap.type');


module.exports = new GraphQLObjectType({
    name: "TaskType",
    description: "Task type containing gaps list",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID)},
        text: { type: GraphQLNonNull(GraphQLString) },
        gaps: { type: GraphQLList(GapType) }
    }
});
