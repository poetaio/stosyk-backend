const {GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID, GraphQLFloat} = require("graphql");
const TeacherTaskInterfaceType = require("../task/teacherTask/TeacherTask.interface.type");
const {taskController, homeworkController} = require("../../../../controllers");
const StudentWithHWScoreType = require("../../../user/types/student/StudentWithHWScore.type");

module.exports = new GraphQLObjectType({
    name: "TeacherHomeworkType",
    description: "Teacher Homework type",
    fields: () => ({
        homeworkId: { type: GraphQLNonNull(GraphQLID) },
        tasks: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherTaskInterfaceType))),
            resolve: async (parent, args, context) =>
                await taskController.getTasks(parent, args, context)
        },
        students: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentWithHWScoreType))),
            resolve: async (parent, args, context) =>
                await homeworkController.getStudents(parent),
        },
    })
});
