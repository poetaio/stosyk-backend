const {GraphQLList, GraphQLNonNull, GraphQLObjectType} = require("graphql");
const {sentenceController, optionController} = require("../../../../../controllers");
const {TeacherSentenceType} = require("../../sentence");
const TeacherTaskType = require("./TeacherHWTask.interface.type");
const teacherTaskInterfaceFields = require("./teacherHWTaskInterfaceFields");
const QuestionType = require("../../TeacherQuestion.type");
const {StudentAnswerType} = require("../../option");
const TeacherHWQuestionType = require("../../TeacherHWQuestion.type");

module.exports = new GraphQLObjectType({
    name: "QATeacherHWTaskType",
    description: "QA Teacher Task Type",
    interfaces: ([TeacherTaskType]),
    fields: () => ({
        ...teacherTaskInterfaceFields,
        questions: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherHWQuestionType))),
            // parent: taskId, ...,
            resolve: async (parent, args, context) => await sentenceController.getAllQA(parent)
        },
    }),
});
