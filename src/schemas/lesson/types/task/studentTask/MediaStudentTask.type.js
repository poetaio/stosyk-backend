const {GraphQLList, GraphQLNonNull, GraphQLObjectType} = require("graphql");
const {StudentSentenceType, MatchingStudentSentenceLeftType, MatchingStudentSentenceRightType} = require("../../sentence");
const {sentenceController, optionController} = require("../../../../../controllers");
const StudentTaskType = require("./StudentTask.interface.type");
const studentTaskInterfaceTypeFields = require('./studentTaskInterfaceFields');

module.exports = new GraphQLObjectType({
    name: "MediaStudentTaskType",
    description: "Media Task Student Type",
    fields: () => ({
        ...studentTaskInterfaceTypeFields,
    }),
    interfaces: [StudentTaskType],
});
