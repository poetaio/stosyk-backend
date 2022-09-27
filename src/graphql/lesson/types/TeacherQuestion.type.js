const {GraphQLInputObjectType, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInt, GraphQLObjectType, GraphQLID} = require("graphql");
const {TeacherOptionType, StudentAnswerType} = require("./option");
const {optionService} = require("../../../services");
const {optionController} = require("../../../controllers");

module.exports = new GraphQLObjectType({
    name: "TeacherQuestionType",
    description: "Teacher Question Type",
    fields: {
        questionId: { type: GraphQLNonNull(GraphQLID) },
        index: { type: GraphQLNonNull(GraphQLInt) },
        text: { type: GraphQLNonNull(GraphQLString) },
        options: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherOptionType))),
            // parent - questionId, index, text
            resolve: async (parent, args, context) => await optionController.getAllByQuestionId(parent),
        },
        studentAnswers: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentAnswerType))),
            resolve: async (parent, args, context) => await optionController.getQAStudentsAnswersBySentenceId(parent)
        },
    },
});
