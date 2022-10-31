const {GraphQLList, GraphQLNonNull, GraphQLObjectType} = require("graphql");
const {StudentSentenceType, MatchingStudentSentenceLeftType, MatchingStudentSentenceRightType} = require("../../sentence");
const {sentenceController, optionController} = require("../../../../../controllers");
const StudentTaskType = require("./StudentTask.interface.type");
const studentTaskInterfaceTypeFields = require('./studentTaskInterfaceFields');

module.exports = new GraphQLObjectType({
    name: "MatchingStudentTaskType",
    description: "Matching Task Student Type",
    fields: () => ({
        ...studentTaskInterfaceTypeFields,
        leftColumn: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MatchingStudentSentenceLeftType))),
            resolve: async (parent, args, context) =>
                await sentenceController.getSentences(parent, args, context)
        },
        rightColumn: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MatchingStudentSentenceRightType))),
            resolve: async (parent, args, context) => await optionController.getAllMatchingRight(parent)
        }
    }),
    interfaces: [StudentTaskType],
});
