const {GraphQLList, GraphQLNonNull, GraphQLObjectType} = require("graphql");
const {sentenceController, optionController} = require("../../../../../controllers");
const {MatchingTeacherSentenceLeftType, MatchingTeacherSentenceRightType} = require("../../sentence");
const TeacherTaskType = require("./TeacherTask.interface.type");
const teacherTaskInterfaceFields = require("./teacherTaskInterfaceFields");

module.exports = new GraphQLObjectType({
    name: "MatchingTeacherTaskType",
    description: "MatchingTeacherTaskType. Contains left part and right part to connect including right option for each sentence from the left part",
    interfaces: ([TeacherTaskType]),
    fields: () => ({
        ...teacherTaskInterfaceFields,
        leftColumn: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(MatchingTeacherSentenceLeftType))),
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
