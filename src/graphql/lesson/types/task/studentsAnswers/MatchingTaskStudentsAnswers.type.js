const { GraphQLObjectType, GraphQLNonNull, GraphQLList} = require("graphql");
const { SentenceStudentsAnswersType, MatchingSentenceStudentsAnswersType} = require('../../sentence');
const taskStudentsAnswersFields = require("./taskStudentsAnswersFields");
const TaskStudentsAnswersInterfaceType = require("./TaskStudentsAnswers.interface.type");
const {sentenceService} = require("../../../../../services");
const {sentenceController} = require("../../../../../controllers");

module.exports = new GraphQLObjectType({
    name: 'MatchingTaskStudentsAnswersType',
    description: 'MatchingTaskStudentsAnswersType. Contains all left column sentences with students and options they have chosen',
    fields: () => ({
        ...taskStudentsAnswersFields,
        leftColumn: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MatchingSentenceStudentsAnswersType))),
            resolve: async (parent, args, context) => await sentenceController.getAllMatchingLeft(parent)
        }
    }),
    interfaces: [TaskStudentsAnswersInterfaceType],
});
