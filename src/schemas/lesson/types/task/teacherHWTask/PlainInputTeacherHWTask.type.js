const {GraphQLList, GraphQLNonNull, GraphQLObjectType} = require("graphql");
const {sentenceController} = require("../../../../../controllers");
const {TeacherSentenceType, TeacherHWSentenceType} = require("../../sentence");
const TeacherTaskType = require("./TeacherHWTask.interface.type");
const teacherTaskInterfaceFields = require("./teacherHWTaskInterfaceFields");

module.exports = new GraphQLObjectType({
    name: "PlainInputTeacherHWTaskType",
    description: "Plain Input Teacher Task Type",
    interfaces: ([TeacherTaskType]),
    fields: () => ({
        ...teacherTaskInterfaceFields,
        sentences: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherHWSentenceType))),
            resolve: async (parent, args, context) =>
                await sentenceController.getSentences(parent, args, context)
        },
    }),
});
