const { GraphQLObjectType, GraphQLNonNull, GraphQLList} = require("graphql");
const { SentenceCorrectAnswersType} = require('../../sentence');
const TaskCorrectAnswerInterfaceType = require("./TaskCorrectAnswer.interface.type");
const taskCorrectAnswersFields = require("./taskCorrectAnswerFields");


module.exports = new GraphQLObjectType({
    name: 'MultipleChoiceTaskCorrectAnswersType',
    description: 'Multiple Choice Task correct answers type',
    fields: () => ({
        ...taskCorrectAnswersFields,
        sentencesAnswers: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SentenceCorrectAnswersType))) }
    }),
    interfaces: [TaskCorrectAnswerInterfaceType]
});
