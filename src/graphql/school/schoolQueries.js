const {GraphQLNonNull, GraphQLList, GraphQLID} = require("graphql");
const {TeacherSchoolType, StudentSchoolType} = require("./types");
const {schoolController, invitationController} = require("../../controllers/school");
const {resolveAuthMiddleware} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");
const {SchoolInvitationType} = require("./types/invitation");

const myInvitations = {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SchoolInvitationType))),
    name: 'myInvitations',
    description: 'Invite school student',
    resolve: async (parent, args, context) => await invitationController.getStudentInvitations(context)
};

const teacherSchool = {
    type: new GraphQLNonNull(TeacherSchoolType),
    name: 'teacherSchool',
    description: 'School. (teacher)',
    resolve: async (parent, args, context) => await schoolController.getSchool(context)
};

const studentSchools = {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentSchoolType))),
    name: 'studentSchools',
    description: 'School (student).',
    args: {
        schoolId: { type: GraphQLID },
    },
    resolve: async (parent, args, context) => await schoolController.getStudentSchools(args, context)
};

module.exports = {
    teacherSchool: resolveAuthMiddleware(UserRoleEnum.TEACHER)(teacherSchool),
    studentSchools: resolveAuthMiddleware(UserRoleEnum.STUDENT)(studentSchools),

    myInvitations: resolveAuthMiddleware(UserRoleEnum.STUDENT)(myInvitations),
};
