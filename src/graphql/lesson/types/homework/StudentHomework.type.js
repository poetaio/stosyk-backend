const {GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID} = require("graphql");
const {StudentTaskInterfaceType} = require("../task");
const {taskController} = require("../../../../controllers");

module.exports = new GraphQLObjectType({
    name: "StudentHomeworkType",
    description: "Student Homework type",
    fields: {
        homeworkId: { type: new GraphQLNonNull(GraphQLID) },
        tasks: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentTaskInterfaceType))),
            resolve: async (parent, args, context) =>
                await taskController.getTasks(parent, args, context)
        }
    }
});
