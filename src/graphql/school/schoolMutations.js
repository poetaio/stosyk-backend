const {GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLID, GraphQLString} = require("graphql");
const {schoolController} = require("../../controllers/school");
const {resolveAuthMiddleware} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");

const addSchoolStudentSeats = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'addSchoolStudentSeats',
    description: 'Add seats to student_seat',
    args: {
        count: { type: GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args, context) => await schoolController.addStudentsSeats(args, context)
};

// student_seat id + student id
const inviteSchoolStudent = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'inviteSchoolStudent',
    description: 'Invite school student',
    args: {
        studentEmail: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, context) => await schoolController.inviteSchoolStudent(args, context)
};

// student_seat id + student id
const acceptSchoolStudentInvitation = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'acceptSchoolStudentInvitation',
    description: 'Accept invitation to school from student',
    args: {
        inviteToken: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, context) => await schoolController.acceptSchoolStudentInvitation(args, context)
};

// student_seat id + student id
const cancelInviteSchoolStudent = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'cancelInviteSchoolStudent',
    description: 'Cancel invite school student',
    args: {
        studentEmail: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, context) => await schoolController.cancelInviteSchoolStudent(args, context)
};

// student_seat id + student id
const removeSchoolStudent = {
    type: GraphQLNonNull(GraphQLBoolean),
    name: 'removeSchoolStudent',
    description: 'Remove student from school',
    args: {
        studentId: { type: GraphQLNonNull(GraphQLID) },
    },
    resolve: async (parent, args, context) => await schoolController.removeSchoolStudent(args, context)
}


module.exports = {
    addSchoolStudentSeats: resolveAuthMiddleware(UserRoleEnum.TEACHER)(addSchoolStudentSeats),
    inviteSchoolStudent: resolveAuthMiddleware(UserRoleEnum.TEACHER)(inviteSchoolStudent),
    cancelInviteSchoolStudent: resolveAuthMiddleware(UserRoleEnum.TEACHER)(cancelInviteSchoolStudent),
    acceptSchoolStudentInvitation: resolveAuthMiddleware(UserRoleEnum.STUDENT)(acceptSchoolStudentInvitation),
    removeSchoolStudent: resolveAuthMiddleware(UserRoleEnum.TEACHER)(removeSchoolStudent),
};
