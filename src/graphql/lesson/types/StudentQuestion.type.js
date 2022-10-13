const {GraphQLInputObjectType, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInt, GraphQLObjectType, GraphQLID} = require("graphql");
const {TeacherOptionType, StudentOptionType, OptionAnswerType} = require("./option");
const {optionService} = require("../../../services");
const {optionController} = require("../../../controllers");

module.exports = new GraphQLObjectType({
    name: "QuestionType",
    description: "Question Type",
    fields: {
        questionId: { type: new GraphQLNonNull(GraphQLID) },
        index: { type: new GraphQLNonNull(GraphQLInt) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        options: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentOptionType))),
            // parent - questionId, index, text
            resolve: async (parent, args, context) => await optionController.getAllByQuestionId(parent),
        },
        chosenOption: {
            type: StudentOptionType,
            resolve: async (parent, args, context) => await optionController.getQuestionChosenOptionByStudentId(parent, context)
        },
        correctOption: {
            type: OptionAnswerType,
            resolve: async (parent, args, context) => await optionController.getQuestionCorrectOptionForStudent(parent),
        },
    },
});
