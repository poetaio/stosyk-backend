const {GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLID} = require("graphql");
const { StudentOptionType, OptionAnswerType} = require("../option");
const {gapController, optionController} = require("../../../../controllers");

module.exports = new GraphQLObjectType({
    name: 'StudentGapType',
    description: 'Student Gap Type',
    fields: {
        gapId: { type: new GraphQLNonNull(GraphQLID) },
        position: { type: new GraphQLNonNull(GraphQLInt) },
        options: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentOptionType))),
            resolve: async (parent, args, context) =>
                await optionController.getOptionsForStudent(parent, args, context)
        },
        chosenOption: {
            type: StudentOptionType,
            resolve: async (parent, args, context) =>
                await gapController.getStudentAnswer(parent, args, context)
        },
        correctOption: {
            type: OptionAnswerType,
            resolve: async (parent, args, context) =>
                await optionController.getCorrectOptionByGapId(parent, args, context)
        }
    }
});
