const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInt} = require("graphql");
const SchoolStudentSeatStatusEnumType = require("../../../school/types/student_seat/SchoolStudentSeatStatusEnum.type");

module.exports = new GraphQLObjectType({
    name: "SchoolStudentType",
    description: "Student with results",
    fields: {
        studentId: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLNonNull(SchoolStudentSeatStatusEnumType)},
        score: { type: GraphQLInt },
    },
});
