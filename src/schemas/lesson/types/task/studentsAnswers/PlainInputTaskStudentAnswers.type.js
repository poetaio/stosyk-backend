const { GraphQLObjectType, GraphQLNonNull, GraphQLList} = require("graphql");
const { SentenceStudentsAnswersType } = require('../../sentence');
const taskStudentsAnswersFields = require("./taskStudentsAnswersFields");
const TaskStudentsAnswersInterfaceType = require("./TaskStudentsAnswers.interface.type");


module.exports = new GraphQLObjectType({
    name: 'PlainInputTaskStudentAnswersType',
    description: 'Plain Input Task student answers type',
    fields: () => ({
        ...taskStudentsAnswersFields,
        sentences: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SentenceStudentsAnswersType))) }
    }),
    interfaces: [TaskStudentsAnswersInterfaceType],
});
