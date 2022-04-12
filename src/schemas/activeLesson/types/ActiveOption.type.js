const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "ActiveTaskType",
    description: "Active task type",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        value: { type: GraphQLNonNull(GraphQLString) }
    }
});
