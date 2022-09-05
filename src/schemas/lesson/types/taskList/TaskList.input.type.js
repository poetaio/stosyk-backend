const {GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const { TaskInputType } = require("../task");

module.exports = new GraphQLInputObjectType({
    name: "TaskListInputType",
    description: "TaskList input type",
    fields: {
        name: { type: GraphQLNonNull(GraphQLString) },
        tasks: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TaskInputType))) },
    }
});