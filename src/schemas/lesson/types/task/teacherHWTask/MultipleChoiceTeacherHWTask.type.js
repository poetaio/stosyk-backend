const {GraphQLList, GraphQLNonNull, GraphQLObjectType} = require("graphql");
const {sentenceController} = require("../../../../../controllers");
const {TeacherHWSentenceType} = require("../../sentence");
const teacherTaskInterfaceFields = require("./teacherHWTaskInterfaceFields");
const TeacherHWTaskInterfaceType = require("./TeacherHWTask.interface.type");

module.exports = new GraphQLObjectType({
    name: "MultipleChoiceTeacherHWTaskType",
    description: " Multiple Choice Teacher Task Type",
    interfaces: ([TeacherHWTaskInterfaceType]),
    fields: () => ({
        ...teacherTaskInterfaceFields,
        sentences: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherHWSentenceType))),
            resolve: async (parent, args, context) =>
                await sentenceController.getSentences(parent, args, context)
        },
    }),
});
