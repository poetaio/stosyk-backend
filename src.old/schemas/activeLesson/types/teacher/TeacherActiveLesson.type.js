const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList} = require("graphql");
const {StudentType, TeacherType} = require("../../../types");
const TeacherActiveTaskType = require('./TeacherActiveTask.type');
const ActiveLessonStatusEnumType = require('../ActiveLessonStatusEnum.type');

module.exports = new GraphQLObjectType({
    name: "TeacherActiveLessonType",
    description: "Teacher Active lesson type with students' answers and right answers",
    fields: {
        id: { type: GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLNonNull(ActiveLessonStatusEnumType)},
        tasks: { type: GraphQLList(TeacherActiveTaskType)},
        students: { type: GraphQLList(StudentType) },
        teacher: { type: TeacherType },
    }
});
