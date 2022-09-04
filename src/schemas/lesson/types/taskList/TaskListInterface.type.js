const {GraphQLInterfaceType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const {StudentTaskInterfaceType} = require("../task");
const {taskController} = require("../../../../controllers");

module.exports = new GraphQLInterfaceType({
    name: 'TaskListType',
    description: 'Task List Type',
    fields: {
        taskListId: {type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        tasks: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentTaskInterfaceType))),
            resolve: async (parent, args, context) =>
                await taskController.getTasks(parent, args, context)
        },
    },
})
