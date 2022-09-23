const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString} = require("graphql");
const {SchoolStudentType} = require("../../../user/types");
const {seatController} = require("../../../../controllers/school");
const SchoolStudentSeatStatusEnumType = require("./SchoolStudentSeatStatusEnum.type");

module.exports = new GraphQLObjectType({
    name: "SchoolStudentSeatType",
    description: "Student seat containing student and their result",
    fields: {
        seatId: { type: GraphQLNonNull(GraphQLID) },
        status: { type: GraphQLNonNull(SchoolStudentSeatStatusEnumType)},
        joinedAt: { type: GraphQLString },
        student: {
            type: SchoolStudentType,
            resolve: async (parent, args, context) => await seatController.getStudent(parent),
        },
    },
});
