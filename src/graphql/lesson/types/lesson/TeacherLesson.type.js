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
        lessonId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(LessonStatusEnumType) },
        tasks: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TeacherTaskInterfaceType))),
            resolve: async (parent, args, context) =>
                await taskController.getTasks(parent, args, context)
        },
        homework: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TeacherHomeworkType))),
            resolve: async (parent, args, context) => await homeworkController.getAllByLessonId(parent),
        },
        students: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentWithLessonScoreType))),
            resolve: async (parent, args, context) =>
                await lessonController.getStudents(parent),
        },
    })
});
