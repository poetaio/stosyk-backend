const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const { StudentTaskType } = require("../task");
const LessonStatusEnumType = require("./LessonStatusEnum.type");


module.exports = new GraphQLObjectType({
    name: "StudentLessonType",
    description: "Student Lesson type",
    fields: {
        lessonId: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLNonNull(LessonStatusEnumType) },
        tasks: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentTaskType))),
            // todo: add resolve
        }
    }
});
