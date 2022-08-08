const {GraphQLList, GraphQLNonNull, GraphQLObjectType} = require("graphql");
const {sentenceController, optionController} = require("../../../../../controllers");
const {MatchingTeacherSentenceLeftType, MatchingTeacherSentenceRightType, MatchingTeacherHWSentenceLeftType} = require("../../sentence");
const TeacherTaskType = require("./TeacherHWTask.interface.type");
const teacherTaskInterfaceFields = require("./teacherHWTaskInterfaceFields");

module.exports = new GraphQLObjectType({
    name: "MatchingTeacherHWTaskType",
    description: "MatchingTeacherTaskType. Contains left part and right part to connect including right option for each sentence from the left part",
    interfaces: ([TeacherTaskType]),
    fields: () => ({
        ...teacherTaskInterfaceFields,
        leftColumn: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MatchingTeacherHWSentenceLeftType))),
            // parent: taskId, ...,
            resolve: async (parent, args, context) => await sentenceController.getAllMatchingLeft(parent)
        },
        rightColumn: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MatchingTeacherSentenceRightType))),
            // parent: taskId, ...,
            resolve: async (parent, args, context) => await optionController.getAllMatchingRight(parent)
        },
    }),
});
