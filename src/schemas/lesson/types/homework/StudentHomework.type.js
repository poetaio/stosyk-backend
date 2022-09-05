const {GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID} = require("graphql");
const {taskController} = require("../../../../controllers");
const {TaskListInterfaceType} = require("../taskList");

module.exports = new GraphQLObjectType({
    name: "StudentHomeworkType",
    description: "Student Homework type",
    fields: {
        homeworkId: { type: GraphQLNonNull(GraphQLID) },
        sections: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TaskListInterfaceType))),
            resolve: async (parent, args, context) =>
                await taskController.getTaskLists(parent, args, context)
        },
    }
});
