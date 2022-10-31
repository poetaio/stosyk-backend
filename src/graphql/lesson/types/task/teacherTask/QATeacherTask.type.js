const {GraphQLList, GraphQLNonNull, GraphQLObjectType} = require("graphql");
const {sentenceController, optionController} = require("../../../../../controllers");
const {TeacherSentenceType} = require("../../sentence");
const TeacherTaskType = require("./TeacherTask.interface.type");
const teacherTaskInterfaceFields = require("./teacherTaskInterfaceFields");
const QuestionType = require("../../TeacherQuestion.type");
const {StudentAnswerType} = require("../../option");

module.exports = new GraphQLObjectType({
    name: "QATeacherTaskType",
    description: "QA Teacher Task Type",
    interfaces: ([TeacherTaskType]),
    fields: () => ({
        ...teacherTaskInterfaceFields,
        questions: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(QuestionType))),
            // parent: taskId, ...,
            resolve: async (parent, args, context) => await sentenceController.getAllQA(parent)
        }
    }),
});
