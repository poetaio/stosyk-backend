const {GraphQLList, GraphQLNonNull, GraphQLObjectType} = require("graphql");
const {sentenceController} = require("../../../../../controllers");
const {TeacherSentenceType} = require("../../sentence");
const TeacherTaskType = require("./TeacherTask.interface.type");
const teacherTaskInterfaceFields = require("./teacherTaskInterfaceFields");
const QuestionType = require("../../Question.type");

module.exports = new GraphQLObjectType({
    name: "QATeacherTaskType",
    description: "QA Teacher Task Type",
    interfaces: ([TeacherTaskType]),
    fields: () => ({
        ...teacherTaskInterfaceFields,
        questions: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(QuestionType))),
            // parent: taskId, ...,
            resolve: async (parent, args, context) => await sentenceController.getAllQA(parent)
        }
    }),
});
