const {GraphQLList, GraphQLNonNull, GraphQLObjectType} = require("graphql");
const {sentenceController} = require("../../../../../controllers");
const StudentTaskType = require("./StudentTask.interface.type");
const studentTaskInterfaceTypeFields = require('./studentTaskInterfaceFields');
const StudentQuestionType = require("../../StudentQuestion.type");

module.exports = new GraphQLObjectType({
    name: "QAStudentTaskType",
    description: "QA Task Student Type",
    fields: () => ({
        ...studentTaskInterfaceTypeFields,
        questions: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentQuestionType))),
            // parent: taskId, ...,
            resolve: async (parent, args, context) => await sentenceController.getAllQA(parent)
        }
    }),
    interfaces: [StudentTaskType],
});
