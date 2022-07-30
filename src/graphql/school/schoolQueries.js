const {GraphQLNonNull, GraphQLList, GraphQLInt} = require("graphql");
const {SchoolStudentSeatType} = require("./types");
const {schoolController} = require("../../controllers/school");
const {resolveAuthMiddleware} = require("../../middleware");
const {UserRoleEnum} = require("../../utils");
const {StudentType, SchoolStudentType} = require("../user/types");

// resolve for students
const schoolSeats = {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SchoolStudentSeatType))),
    name: 'schoolSeats',
    description: 'Get all seats for teacher\'s school',
    resolve: async (parent, args, context) => await schoolController.getSeats(context)
};

const schoolStudents = {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SchoolStudentType))),
    name: 'schoolStudents',
    description: 'Get all students for teacher\'s school',
    resolve: async (parent, args, context) => await schoolController.getStudents(context)
};

const freeSeatCount = {
    type: GraphQLNonNull(GraphQLInt),
    name: 'freeSeatCount',
    description: 'Get number of free seats',
    resolve: async (parent, args, context) => await schoolController.getFreeSeatsCount(context)
};

module.exports = {
    schoolSeats: resolveAuthMiddleware(UserRoleEnum.TEACHER)(schoolSeats),
    schoolStudents: resolveAuthMiddleware(UserRoleEnum.TEACHER)(schoolStudents),
    freeSeatCount: resolveAuthMiddleware(UserRoleEnum.TEACHER)(freeSeatCount),
};
