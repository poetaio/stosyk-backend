const {GraphQLInputObjectType, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInt, GraphQLObjectType, GraphQLID} = require("graphql");
const {TeacherOptionType, StudentAnswerType} = require("./option");
const {optionService} = require("../../../services");
const {optionController} = require("../../../controllers");

module.exports = new GraphQLObjectType({
    name: "TeacherQuestionType",
    description: "Teacher Question Type",
    fields: {
        questionId: { type: new GraphQLNonNull(GraphQLID) },
        index: { type: new GraphQLNonNull(GraphQLInt) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        options: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TeacherOptionType))),
            // parent - questionId, index, text
            resolve: async (parent, args, context) => await optionController.getAllByQuestionId(parent),
        },
        studentAnswers: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentAnswerType))),
            resolve: async (parent, args, context) => await optionController.getQAStudentsAnswersBySentenceId(parent)
        },
    },
});
