const {GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInputObjectType} = require("graphql");
const GapCreateType = require('./GapCreate.type');


module.exports = new GraphQLInputObjectType({
    name: "TaskCreateType",
    description: "Task type containing gaps list, name, decription and text",
    fields: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        text: { type: GraphQLNonNull(GraphQLString) },
        gaps: { type: GraphQLList(GraphQLNonNull(GapCreateType)) }
    }
});
