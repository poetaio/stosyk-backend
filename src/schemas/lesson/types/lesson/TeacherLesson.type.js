const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID, GraphQLEnumType} = require("graphql");
const { TeacherTaskType } = require("../task");
const { taskController } = require('../../../../controllers');
const LessonStatusEnumType = require("./LessonStatusEnum.type");


module.exports = new GraphQLObjectType({
    name: "TeacherLessonType",
    description: "Teacher Lesson type",
    fields: {
        lessonId: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLNonNull(LessonStatusEnumType) },
        tasks: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherTaskType))),
            resolve: async (parent, args, context) =>
                await taskController.getTasks(parent, args, context)
        }
    }
});
