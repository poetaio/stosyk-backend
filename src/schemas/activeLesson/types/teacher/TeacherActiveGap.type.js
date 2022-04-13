const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList, GraphQLBoolean, GraphQLInt} = require("graphql");
const ActiveOptionType = require('../ActiveOption.type');
const StudentAnswerType = require('../student/StudentAnswer.type');

module.exports = new GraphQLObjectType({
    name: "TeacherActiveGapType",
    description: "Teacher Active gap type",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        gapPosition: { type: GraphQLNonNull(GraphQLInt) },
        options: { type: GraphQLList(ActiveOptionType) },
        rightOption: { type: GraphQLNonNull(ActiveOptionType)},
        studentsAnswers: { type: GraphQLList(StudentAnswerType) },
        answerShown: { type: GraphQLNonNull(GraphQLBoolean) }
    }
});
