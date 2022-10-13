const {GraphQLNonNull, GraphQLList, GraphQLInt} = require("graphql");
const {SchoolStudentSeatType, SchoolType} = require("./types");
const {schoolController, invitationController} = require("../../controllers/school");
const {resolveAuthMiddleware} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");
const {SchoolStudentType} = require("../user/types");
const {SchoolInvitationType} = require("./types/invitation");

// resolve for students
const schoolSeats = {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SchoolStudentSeatType))),
    name: 'schoolSeats',
    description: 'Get all seats for teacher\'s school',
    resolve: async (parent, args, context) => await schoolController.getSeats(context)
};

const schoolStudents = {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SchoolStudentType))),
    name: 'schoolStudents',
    description: 'Get all students for teacher\'s school',
    resolve: async (parent, args, context) => await schoolController.getStudents(context)
};

const freeSeatCount = {
    type: new GraphQLNonNull(GraphQLInt),
    name: 'freeSeatCount',
    description: 'Get number of free seats',
    resolve: async (parent, args, context) => await schoolController.getFreeSeatsCount(context)
};

const schoolInvitations = {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SchoolInvitationType))),
    name: 'schoolInvitations',
    description: 'Retrieve all school invitations',
    resolve: async (parent, args, context) => await invitationController.getSchoolInvitations(context)
};

const myInvitations = {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SchoolInvitationType))),
    name: 'myInvitations',
    description: 'Invite school student',
    resolve: async (parent, args, context) => await invitationController.getStudentInvitations(context)
};

const school = {
    type: new GraphQLNonNull(SchoolType),
    name: 'school',
    description: 'School.',
    resolve: async (parent, args, context) => await schoolController.getSchool(context)
};

module.exports = {
    schoolSeats: resolveAuthMiddleware(UserRoleEnum.TEACHER)(schoolSeats),
    schoolStudents: resolveAuthMiddleware(UserRoleEnum.TEACHER)(schoolStudents),
    freeSeatCount: resolveAuthMiddleware(UserRoleEnum.TEACHER)(freeSeatCount),
    school: resolveAuthMiddleware(UserRoleEnum.TEACHER)(school),
    schoolInvitations: resolveAuthMiddleware(UserRoleEnum.TEACHER)(schoolInvitations),

    myInvitations: resolveAuthMiddleware(UserRoleEnum.STUDENT)(myInvitations),
};
