const {GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID, GraphQLFloat} = require("graphql");
const TeacherTaskInterfaceType = require("../task/teacherTask/TeacherTask.interface.type");
const {taskController, homeworkController} = require("../../../../controllers");
const StudentWithHWScoreType = require("../../../user/types/student/StudentWithHWScore.type");

module.exports = new GraphQLObjectType({
    name: "TeacherHomeworkType",
    description: "Teacher Homework type",
    fields: () => ({
        homeworkId: { type: new GraphQLNonNull(GraphQLID) },
        tasks: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TeacherTaskInterfaceType))),
            resolve: async (parent, args, context) =>
                await taskController.getTasks(parent, args, context)
        },
        students: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentWithHWScoreType))),
            resolve: async (parent, args, context) =>
                await homeworkController.getStudents(parent),
        },
    })
});
