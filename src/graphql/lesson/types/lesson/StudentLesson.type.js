const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const { StudentTaskInterfaceType } = require("../task");
const LessonStatusEnumType = require("./LessonStatusEnum.type");
const {taskController, homeworkController} = require("../../../../controllers");
const {StudentHomeworkType} = require("../homework");


module.exports = new GraphQLObjectType({
    name: "StudentLessonType",
    description: "Student Lesson type",
    fields: {
        lessonId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(LessonStatusEnumType) },
        tasks: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentTaskInterfaceType))),
            resolve: async (parent, args, context) =>
                await taskController.getTasks(parent, args, context)
        },
        homework: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentHomeworkType))),
            resolve: async ({lessonId}, args, context) =>
                await homeworkController.getAllForStudent({where: {lessonId}}, context),
        }
    }
});
