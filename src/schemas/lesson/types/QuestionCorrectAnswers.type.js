const {GraphQLInputObjectType, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInt, GraphQLObjectType, GraphQLID} = require("graphql");
const {TeacherOptionType, OptionAnswerType} = require("./option");
const {optionService} = require("../../../services");
const {optionController} = require("../../../controllers");

module.exports = new GraphQLObjectType({
    name: "QuestionCorrectAnswersType",
    description: "Contains all correct options",
    fields: {
        questionId: { type: GraphQLNonNull(GraphQLID) },
        correctOption: {
            type: GraphQLNonNull(OptionAnswerType),
            resolve: async (parent, args, context) => await optionController.getQuestionCorrectOption(parent),
        }
    },
});
