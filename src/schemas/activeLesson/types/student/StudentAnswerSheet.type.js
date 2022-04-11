/*
id: "sdfsd-adfa-2ksf2",
status: JOINED
answers: [
    // todo: change to gap
    {
        answerToId: "sdfs-sdfa-adfsdfs2",
        chosenOption: {
            id: "sdfs-sdfa-adfsdfs2",
            value: "Slava Ukraini'
        }
    }
]
 */

const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const StudentAnswerSheetStatusType = require('./StudentAnswerSheetStatus.type')
const StudentAnswerSheetAnswerType = require('./StudentAnswerSheetAnswer.type');

module.exports = new GraphQLObjectType({
    name: "StudentAnswerSheetType",
    description: "Student answer sheet type",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        status: { type: GraphQLNonNull(StudentAnswerSheetStatusType) },
        answers: { type: GraphQLList(StudentAnswerSheetAnswerType) }
    }
});
