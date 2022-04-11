const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const ActiveOptionType = require('../ActiveOption.type');
const StudentAnswerType = require('../student/StudentAnswer.type');

module.exports = new GraphQLObjectType({
    name: "TeacherActiveSentenceType",
    description: "Teacher Active task type",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        options: { type: GraphQLList(ActiveOptionType) },
        rightOption: { type: GraphQLNonNull(ActiveOptionType)},
        studentsAnswers: { type: GraphQLList(StudentAnswerType) }
    }
});
