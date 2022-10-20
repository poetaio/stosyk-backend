const { GraphQLObjectType, GraphQLNonNull, GraphQLList} = require("graphql");
const {SentenceCorrectAnswersType, MatchingSentenceCorrectAnswersType} = require('../../sentence');
const TaskCorrectAnswerInterfaceType = require("./TaskCorrectAnswer.interface.type");
const taskCorrectAnswersFields = require("./taskCorrectAnswerFields");
const {sentenceController} = require("../../../../../controllers");


module.exports = new GraphQLObjectType({
    name: 'MatchingTaskCorrectAnswersType',
    description: 'Plain Input Task correct answers type',
    fields: () => ({
        ...taskCorrectAnswersFields,
        leftColumn: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MatchingSentenceCorrectAnswersType))),
            resolve: async (parent, args, context) => await sentenceController.getAllMatchingLeft(parent)
        }
    }),
    interfaces: [TaskCorrectAnswerInterfaceType]
});
