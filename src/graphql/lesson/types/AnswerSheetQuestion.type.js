const {GraphQLNonNull, GraphQLList, GraphQLObjectType, GraphQLID} = require("graphql");
const {StudentAnswerType, StudentOptionType} = require("./option");
const {optionController} = require("../../../controllers");

module.exports = new GraphQLObjectType({
    name: "AnswerSheetQuestionType",
    description: "Right column sentence that contains specific student chosen option from the right column",
    fields: {
        questionId: { type: GraphQLNonNull(GraphQLID) },
        chosenOption: {
            type: StudentOptionType,
            resolve: async (parent, args, context) => await optionController.getQuestionChosenOptionByStudentId(parent, context)
        }
    },
});
