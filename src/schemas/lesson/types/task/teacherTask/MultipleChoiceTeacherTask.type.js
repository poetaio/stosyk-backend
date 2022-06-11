const {GraphQLList, GraphQLNonNull, GraphQLObjectType} = require("graphql");
const {sentenceController} = require("../../../../../controllers");
const {TeacherSentenceType} = require("../../sentence");
const TeacherTaskType = require("./TeacherTask.interface.type");
const teacherTaskInterfaceFields = require("./teacherTaskInterfaceFields");

module.exports = new GraphQLObjectType({
    name: "MultipleChoiceTeacherTaskType",
    description: " Multiple Choice Teacher Task Type",
    interfaces: ([TeacherTaskType]),
    fields: () => ({
        ...teacherTaskInterfaceFields,
        sentences: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherSentenceType))),
            resolve: async (parent, args, context) =>
                await sentenceController.getSentences(parent, args, context)
        },
    }),
});
