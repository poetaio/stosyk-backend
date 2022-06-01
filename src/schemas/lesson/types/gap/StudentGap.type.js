const {GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLID} = require("graphql");
const { StudentOptionType } = require("../option");
const {gapController, optionController} = require("../../../../controllers");

module.exports = new GraphQLObjectType({
    name: 'StudentGapType',
    description: 'Student Gap Type',
    fields: {
        gapId: { type: GraphQLNonNull(GraphQLID) },
        position: { type: GraphQLNonNull(GraphQLInt) },
        options: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentOptionType))),
            resolve: async (parent, args, context) =>
                await optionController.getOptionsForStudent(parent, args, context)
        },
        chosenOption: {
            type: StudentOptionType,
            resolve: async (parent, args, context) =>
                await gapController.getStudentAnswer(parent, args, context)
        },
    }
});
