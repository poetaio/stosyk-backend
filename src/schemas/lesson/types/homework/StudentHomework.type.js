const {GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID} = require("graphql");
const {StudentTaskInterfaceType} = require("../task");
const {taskController} = require("../../../../controllers");

module.exports = new GraphQLObjectType({
    name: "StudentHomeworkType",
    description: "Student Homework type",
    fields: {
        homeworkId: { type: GraphQLNonNull(GraphQLID) },
        tasks: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentTaskInterfaceType))),
            resolve: async (parent, args, context) =>
                await taskController.getTasks(parent, args, context)
        }
    }
});
