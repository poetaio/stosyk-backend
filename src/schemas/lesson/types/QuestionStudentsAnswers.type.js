const {GraphQLNonNull, GraphQLList, GraphQLObjectType, GraphQLID} = require("graphql");
const {StudentAnswerType} = require("./option");
const {optionController} = require("../../../controllers");

module.exports = new GraphQLObjectType({
    name: "QuestionStudentsAnswersType",
    description: "Contains all students' answers ",
    fields: {
        questionId: { type: GraphQLNonNull(GraphQLID) },
        studentAnswers: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentAnswerType))),
            resolve: async (parent, args, context) => await optionController.getQAStudentsAnswersBySentenceId(parent)
        }
    },
});
