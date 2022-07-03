const {GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID} = require("graphql");
const {TeacherTaskInterfaceType} = require("../task");
const {taskController} = require("../../../../controllers");
module.exports = new GraphQLObjectType({
    name: "TeacherHomeworkType",
    description: "Teacher Homework type",
    fields: {
        homeworkId: { type: GraphQLNonNull(GraphQLID) },
        tasks: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherTaskInterfaceType))),
            resolve: async (parent, args, context) =>
                await taskController.getTasks(parent, args, context)
        }
    }
});
