const { GraphQLObjectType } = require("graphql");
const TaskCorrectAnswerInterfaceType = require("./TaskCorrectAnswer.interface.type");
const taskCorrectAnswersFields = require("./taskCorrectAnswerFields");


module.exports = new GraphQLObjectType({
    name: 'MediaTaskCorrectAnswersType',
    description: 'Media Task correct answers type',
    fields: () => ({
        ...taskCorrectAnswersFields,
    }),
    interfaces: [TaskCorrectAnswerInterfaceType]
});
