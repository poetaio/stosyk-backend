const {GraphQLList, GraphQLNonNull, GraphQLObjectType} = require("graphql");
const {StudentSentenceType} = require("../../sentence");
const {sentenceController} = require("../../../../../controllers");
const StudentTaskType = require("./StudentTask.interface.type");
const studentTaskInterfaceTypeFields = require('./studentTaskInterfaceFields');

module.exports = new GraphQLObjectType({
    name: "MultipleChoiceStudentTaskType",
    description: "Multiple Choice Task Student Type",
    fields: () => ({
        ...studentTaskInterfaceTypeFields,
        sentences: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentSentenceType))),
            resolve: async (parent, args, context) =>
                await sentenceController.getSentences(parent, args, context)
        },
    }),
    interfaces: [StudentTaskType],
});
