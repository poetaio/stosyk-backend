const { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLInt} = require("graphql");
const { SentenceStudentsAnswersType, MatchingSentenceStudentsAnswersType} = require('../../sentence');
const taskStudentsAnswersFields = require("./taskStudentsAnswersFields");
const TaskStudentsAnswersInterfaceType = require("./TaskStudentsAnswers.interface.type");
const {sentenceService} = require("../../../../../services");
const {sentenceController} = require("../../../../../controllers");

module.exports = new GraphQLObjectType({
    name: 'QATaskStudentsAnswersType',
    description: 'QATaskStudentsAnswersType. Contains questions and students answers each',
    fields: () => ({
        ...taskStudentsAnswersFields,
        questions: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLInt))),
            // todo:
            resolve: async (parent, args, context) => [1,2,3]
        }
    }),
    interfaces: [TaskStudentsAnswersInterfaceType],
});
