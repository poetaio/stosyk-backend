const { GraphQLObjectType, GraphQLNonNull, GraphQLList} = require("graphql");
const {SentenceCorrectAnswersType, MatchingSentenceCorrectAnswersType} = require('../../sentence');
const TaskCorrectAnswerInterfaceType = require("./TaskCorrectAnswer.interface.type");
const taskCorrectAnswersFields = require("./taskCorrectAnswerFields");
const {sentenceController} = require("../../../../../controllers");
const QuestionCorrectAnswersType = require("../../QuestionCorrectAnswers.type");
const {sentenceService} = require("../../../../../services");


module.exports = new GraphQLObjectType({
    name: 'QATaskCorrectAnswersType',
    description: 'QA Task correct answers type',
    fields: () => ({
        ...taskCorrectAnswersFields,
        questionsAnswers: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(QuestionCorrectAnswersType))),
            resolve: async (parent, args, context) => await sentenceController.getAllQA(parent)
        }
    }),
    interfaces: [TaskCorrectAnswerInterfaceType]
});
