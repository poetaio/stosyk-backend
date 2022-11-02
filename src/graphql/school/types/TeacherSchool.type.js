const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList} = require("graphql");
const {schoolController, invitationController} = require("../../../controllers/school");
const {SchoolInvitationType} = require("./invitation");
const {SchoolStudentType} = require("../../user/types");
const {TeacherCountedLessonsType, LessonsWhereType, TeacherCourseType} = require("../../lesson/types");
const {lessonController, courseController} = require("../../../controllers");

// NOTE: name for student school is NOT required
module.exports = new GraphQLObjectType({
    name: "TeacherSchoolType",
    description: "School for teacher",
    fields: {
        name: { type: GraphQLString },
        freeSeatsCount: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Get number of free seats',
            resolve: async (parent, args, context) => await schoolController.countFreeSeats(parent)
        },
        totalSeatsCount: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Get total number of seats',
        },
        lessons: {
            type: TeacherCountedLessonsType,
            description: 'Get school lessons for teacher',
            args: {
                where: { type: LessonsWhereType }
            },
            // todo: return school lessons only, but by schoolId, not by context, and in teacherLessons return private teacherLessons
            resolve: async (parent, args, context) => await lessonController.getLessonsBySchoolIdAndWhere(args, context)
        },
        courses: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TeacherCourseType))),
            description: 'Get All Courses',
            resolve: async (parent, args, context) => await courseController.getAllCourses(context)
        },
        students: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SchoolStudentType))),
            description: 'Get all students for teacher\'s school',
            // todo: fix resolving seats from context:user:userId, but from schoolId, which is in the type above
            resolve: async (parent, args, context) => await schoolController.getStudents(context)
        },
        invites: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SchoolInvitationType))),
            description: 'Retrieve all school invitations',
            // todo: fix resolving seats from context:user:userId, but from schoolId, which is in the type above
            resolve: async (parent, args, context) => await invitationController.getSchoolInvitations(context)
        },
    },
});
