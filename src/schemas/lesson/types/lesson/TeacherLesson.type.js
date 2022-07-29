const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID, GraphQLEnumType} = require("graphql");
const { TeacherTaskInterfaceType } = require("../task");
const { taskController, homeworkController} = require('../../../../controllers');
const LessonStatusEnumType = require("./LessonStatusEnum.type");
const {TeacherHomeworkType} = require("../homework");


module.exports = new GraphQLObjectType({
    name: "TeacherLessonType",
    description: "Teacher Lesson type",
    fields: {
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
        }
    }
});
