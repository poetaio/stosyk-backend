const { GraphQLObjectType, GraphQLNonNull, GraphQLList} = require("graphql");
const {SentenceCorrectAnswersType} = require('../../sentence');
const TaskCorrectAnswerInterfaceType = require("./TaskCorrectAnswer.interface.type");
const taskCorrectAnswersFields = require("./taskCorrectAnswerFields");
const {sentenceController} = require("../../../../../controllers");


module.exports = new GraphQLObjectType({
    name: 'PlainInputTaskCorrectAnswersType',
    description: 'Plain Input Task correct answers type',
    fields: () => ({
        ...taskCorrectAnswersFields,
        sentencesAnswers: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SentenceCorrectAnswersType))),
            resolve: async (parent, args, context) => await sentenceController.getAllWithCorrectOptionsByTaskId(parent)
        }
    }),
    interfaces: [TaskCorrectAnswerInterfaceType]
});
