const {GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID} = require("graphql");
const {taskController, homeworkController} = require("../../../../controllers");
const {StudentWithHWScoreType} = require("../../../user/types");
const {TeacherTaskListInterfaceType} = require("../taskList");
module.exports = new GraphQLObjectType({
    name: "TeacherHomeworkType",
    description: "Teacher Homework type",
    fields: {
        homeworkId: { type: GraphQLNonNull(GraphQLID) },
        sections: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherTaskListInterfaceType))),
            resolve: async (parent, args, context) =>
                await taskController.getTaskLists(parent, args, context)
        },
        students: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentWithHWScoreType))),
            resolve: async (parent, args, context) =>
                await homeworkController.getStudents(parent),
        },
    }
});
