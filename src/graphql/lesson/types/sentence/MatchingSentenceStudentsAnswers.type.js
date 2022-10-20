const {GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID} = require("graphql");
const { GapCorrectAnswersType } = require('../gap');
const {StudentAnswerType} = require("../option");
const {optionService} = require("../../../../services");
const {optionController} = require("../../../../controllers");


module.exports = new GraphQLObjectType({
    name: 'MatchingSentenceStudentsAnswersType',
    description: 'Contains students and options they have chosen',
    fields: {
        sentenceId: { type: new GraphQLNonNull(GraphQLID) },
        studentsAnswers: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentAnswerType))),
            resolve: async (parent, args, context) => await optionController.getMatchingStudentsAnswersBySentenceId(parent)
        },
    }
});
