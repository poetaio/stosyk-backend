const {GraphQLInputObjectType, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInt, GraphQLObjectType, GraphQLID} = require("graphql");
const {TeacherOptionType, StudentOptionType} = require("./option");
const {optionService} = require("../../../services");
const {optionController} = require("../../../controllers");

module.exports = new GraphQLObjectType({
    name: "QuestionType",
    description: "Question Type",
    fields: {
        questionId: { type: GraphQLNonNull(GraphQLID) },
        index: { type: GraphQLNonNull(GraphQLInt) },
        text: { type: GraphQLNonNull(GraphQLString) },
        options: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentOptionType))),
            // parent - questionId, index, text
            resolve: async (parent, args, context) => await optionController.getAllByQuestionId(parent),
        },
        chosenOption: {
            type: StudentOptionType,
            resolve: async (parent, args, context) => await optionController.getQuestionChosenOptionByStudentId(parent, context)
        }
    },
});
