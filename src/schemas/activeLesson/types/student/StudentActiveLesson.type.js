const {GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLList} = require("graphql");
const {TeacherType} = require("../../../types");

const StudentActiveTaskType = require('./StudentActiveTask.type');
const ActiveLessonStatusEnumType = require("../ActiveLessonStatusEnum.type");

module.exports = new GraphQLObjectType({
    name: "StudentActiveLessonType",
    description: "Contains either id, status, teacher or id, status, tasks with options",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        teacher: { type: GraphQLNonNull(TeacherType) },
        status: { type: GraphQLNonNull(ActiveLessonStatusEnumType) },
        // tasks:
        tasks: { type: GraphQLList(StudentActiveTaskType) }
    })
});
