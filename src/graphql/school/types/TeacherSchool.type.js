const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLList} = require("graphql");
const {schoolController, invitationController} = require("../../../controllers/school");
const {SchoolInvitationType} = require("./invitation");
const {SchoolStudentType} = require("../../user/types");
const {SchoolStudentSeatType} = require("./student_seat");
const {TeacherCountedLessonsType, LessonsWhereType, TeacherCourseType} = require("../../lesson/types");
const {lessonController, courseController} = require("../../../controllers");

module.exports = new GraphQLObjectType({
    name: "TeacherSchoolType",
    description: "School for teacher",
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        freeSeatCount: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Get number of free seats',
            // todo: fix resolving seats from context:user:userId, but from schoolId, which is in the type above
            resolve: async (parent, args, context) => await schoolController.getFreeSeatsCount(context)
        },
        seatCount: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Get number of seats',
            // todo: fix resolving seats from context:user:userId, but from schoolId, which is in the type above
            resolve: async (parent, args, context) => await schoolController.getSeatCount(context)
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
        seats: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SchoolStudentSeatType))),
            description: 'Get all seats for teacher\'s school',
            // todo: fix resolving seats from context:user:userId, but from schoolId, which is in the type above
            resolve: async (parent, args, context) => await schoolController.getSeats(context)
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
