const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const { StudentTaskInterfaceType } = require("../task");
const LessonStatusEnumType = require("./LessonStatusEnum.type");
const {taskController, homeworkController} = require("../../../../controllers");
const {StudentHomeworkType} = require("../homework");


module.exports = new GraphQLObjectType({
    name: "StudentLessonType",
    description: "Student Lesson type",
    fields: {
        lessonId: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLNonNull(LessonStatusEnumType) },
        tasks: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentTaskInterfaceType))),
            resolve: async (parent, args, context) =>
                await taskController.getTasks(parent, args, context)
        },
        homework: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentHomeworkType))),
            resolve: async ({lessonId}, args, context) =>
                await homeworkController.getAllForStudent({where: {lessonId}}, context),
        }
    }
});
