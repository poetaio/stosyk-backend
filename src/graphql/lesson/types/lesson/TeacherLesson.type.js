const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID, GraphQLEnumType} = require("graphql");
const TeacherTaskInterfaceType = require("../task/teacherTask/TeacherTask.interface.type");
const { taskController, homeworkController, lessonController} = require('../../../../controllers');
const LessonStatusEnumType = require("./LessonStatusEnum.type");
const TeacherHomeworkType = require("../homework/TeacherHomework.type");
const StudentWithLessonScoreType = require("../../../user/types/student/StudentWithLessonScore.type");

module.exports = new GraphQLObjectType({
    name: "TeacherLessonType",
    description: "Teacher Lesson type",
    fields: () => ({
        lessonId: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLNonNull(LessonStatusEnumType) },
        tasks: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherTaskInterfaceType))),
            resolve: async (parent, args, context) =>
                await taskController.getTasks(parent, args, context)
        },
        homework: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherHomeworkType))),
            resolve: async (parent, args, context) => await homeworkController.getAllByLessonId(parent),
        },
        students: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentWithLessonScoreType))),
            resolve: async (parent, args, context) =>
                await lessonController.getStudents(parent),
        },
    })
});
