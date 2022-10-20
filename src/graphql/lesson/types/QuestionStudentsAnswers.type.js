const {GraphQLNonNull, GraphQLList, GraphQLObjectType, GraphQLID} = require("graphql");
const {StudentAnswerType} = require("./option");
const {optionController} = require("../../../controllers");

module.exports = new GraphQLObjectType({
    name: "QuestionStudentsAnswersType",
    description: "Contains all students' answers ",
    fields: {
        questionId: { type: new GraphQLNonNull(GraphQLID) },
        studentAnswers: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentAnswerType))),
            resolve: async (parent, args, context) => await optionController.getQAStudentsAnswersBySentenceId(parent)
        }
    },
});
