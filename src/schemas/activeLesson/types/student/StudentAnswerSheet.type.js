const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const StudentAnswerSheetStatusType = require('./StudentAnswerSheetStatus.type')
const StudentAnswerSheetAnswerType = require('./StudentAnswerSheetAnswer.type');

module.exports = new GraphQLObjectType({
    name: "StudentAnswerSheetType",
    description: "Student answer sheet type",
    fields: {
        status: { type: GraphQLNonNull(StudentAnswerSheetStatusType) },
        answers: { type: GraphQLList(StudentAnswerSheetAnswerType) }
    }
});
