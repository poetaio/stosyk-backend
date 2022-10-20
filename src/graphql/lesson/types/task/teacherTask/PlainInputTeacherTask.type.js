const {GraphQLList, GraphQLNonNull, GraphQLObjectType} = require("graphql");
const {sentenceController} = require("../../../../../controllers");
const {TeacherSentenceType} = require("../../sentence");
const TeacherTaskType = require("./TeacherTask.interface.type");
const teacherTaskInterfaceFields = require("./teacherTaskInterfaceFields");

module.exports = new GraphQLObjectType({
    name: "PlainInputTeacherTaskType",
    description: "Plain Input Teacher Task Type",
    interfaces: ([TeacherTaskType]),
    fields: () => ({
        ...teacherTaskInterfaceFields,
        sentences: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TeacherSentenceType))),
            resolve: async (parent, args, context) =>
                await sentenceController.getSentences(parent, args, context)
        },
    }),
});
