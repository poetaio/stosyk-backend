const {GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLID, GraphQLString, GraphQLList} = require("graphql");
const {schoolController} = require("../../controllers/school");
const {resolveAuthMiddleware} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");

const addSchoolStudentSeats = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'addSchoolStudentSeats',
    description: 'Add seats to student_seat',
    args: {
        count: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args, context) => await schoolController.addStudentsSeats(args, context)
};

// student_seat id + student id
const inviteSchoolStudent = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'inviteSchoolStudent',
    description: 'Invite school student',
    args: {
        studentEmail: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, context) => await schoolController.inviteSchoolStudent(args, context)
};

// student_seat id + student id
const acceptSchoolStudentInvitation = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'acceptSchoolStudentInvitation',
    description: 'Accept invitation to school from student',
    args: {
        invitationId: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => await schoolController.acceptSchoolStudentInvitation(args, context)
};

// student_seat id + student id
const declineSchoolStudentInvitation = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'declineSchoolStudentInvitation',
    description: 'Accept invitation to school from student',
    args: {
        invitationId: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => await schoolController.declineSchoolStudentInvitation(args, context)
};

const cancelInviteSchoolStudent = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'cancelInviteSchoolStudent',
    description: 'Cancel invite school student',
    args: {
        invitationId: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => await schoolController.cancelInviteSchoolStudent(args, context)
};

const removeSchoolStudent = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'removeSchoolStudent',
    description: 'Remove student from school',
    args: {
        studentId: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => await schoolController.removeSchoolStudent(args, context)
}

const editSchool = {
    type: new GraphQLNonNull(GraphQLBoolean),
    name: 'editSchool',
    description: 'Edit school',
    args: {
        newName: { type: GraphQLString },
        // todo: add packages or smth
    },
    resolve: async (parent, args, context) => await schoolController.editSchool(args, context)
}



module.exports = {
    addSchoolStudentSeats: resolveAuthMiddleware(UserRoleEnum.TEACHER)(addSchoolStudentSeats),
    inviteSchoolStudent: resolveAuthMiddleware(UserRoleEnum.TEACHER)(inviteSchoolStudent),
    cancelInviteSchoolStudent: resolveAuthMiddleware(UserRoleEnum.TEACHER)(cancelInviteSchoolStudent),
    acceptSchoolStudentInvitation: resolveAuthMiddleware(UserRoleEnum.STUDENT)(acceptSchoolStudentInvitation),
    declineSchoolStudentInvitation: resolveAuthMiddleware(UserRoleEnum.STUDENT)(declineSchoolStudentInvitation),
    removeSchoolStudent: resolveAuthMiddleware(UserRoleEnum.TEACHER)(removeSchoolStudent),
    editSchool: resolveAuthMiddleware(UserRoleEnum.TEACHER)(editSchool),
};
