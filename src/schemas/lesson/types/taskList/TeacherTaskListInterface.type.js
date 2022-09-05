const {GraphQLInterfaceType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const {TeacherTaskInterfaceType} = require("../task");
const {taskController} = require("../../../../controllers");

module.exports = new GraphQLInterfaceType({
    name: 'TeacherTaskListType',
    description: 'Teacher Task List Type',
    fields: {
        taskListId: {type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        tasks: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherTaskInterfaceType))),
            resolve: async (parent, args, context) =>
                await taskController.getTasks(parent, args, context)
        },
    },
})
