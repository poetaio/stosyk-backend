const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const LessonStatusEnumType = require("./LessonStatusEnum.type");
const {homeworkController, taskController} = require("../../../../controllers");
const {StudentHomeworkType} = require("../homework");
const {TaskListInterfaceType} = require("../taskList");


module.exports = new GraphQLObjectType({
    name: "StudentLessonType",
    description: "Student Lesson type",
    fields: {
        lessonId: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLNonNull(LessonStatusEnumType) },
        sections: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TaskListInterfaceType))),
            resolve: async (parent, args, context) =>
                await taskController.getTaskLists(parent, args, context)
        },
        homework: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentHomeworkType))),
            resolve: async ({lessonId}, args, context) =>
                await homeworkController.getAllForStudent({where: {lessonId}}, context),
        }
    }
});
