const { GraphQLObjectType } = require("graphql");
const taskStudentsAnswersFields = require("./taskStudentsAnswersFields");
const TaskStudentsAnswersInterfaceType = require("./TaskStudentsAnswers.interface.type");

module.exports = new GraphQLObjectType({
    name: 'MediaTaskStudentsAnswersType',
    description: 'MediaTaskStudentsAnswersType.',
    fields: () => ({
        ...taskStudentsAnswersFields,
    }),
    interfaces: [TaskStudentsAnswersInterfaceType],
});
