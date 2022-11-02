const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const {LessonsWhereType, TeacherCourseType, StudentLessonType} = require("../../lesson/types");
const {lessonController, courseController} = require("../../../controllers");
const StudentSchoolStatusEnumType = require("./StudentSchoolStatusEnum.type");

// NOTE: name for student school is required
module.exports = new GraphQLObjectType({
    name: "StudentSchoolType",
    description: "School for student",
    fields: {
        schoolId: { type: new GraphQLNonNull(GraphQLID) },
        status: { type: new GraphQLNonNull(StudentSchoolStatusEnumType) },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            description: "Can be TEACHER'S name",
        },
        lessons: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentLessonType))),
            description: 'Get school lessons for student',
            args: {
                where: { type: LessonsWhereType },
            },
            resolve: async (parent, args, context) => await lessonController.getLessonsBySchoolIdAndWhere(parent, args)
        },
        courses: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TeacherCourseType))),
            description: 'Get All Courses',
            resolve: async (parent, args, context) => await courseController.getCoursesBySchoolId(parent)
        },
        joinedAt: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Join timestamp',
        },
        droppedOutAt: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Dropout timestamp',
        }
    },
});
