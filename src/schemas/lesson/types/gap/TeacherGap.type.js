const {GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLID} = require("graphql");
const { TeacherOptionType, StudentAnswerType} = require("../option");
const { optionController } = require("../../../../controllers");
const {gapService} = require("../../../../services");

module.exports = new GraphQLObjectType({
    name: 'TeacherGapType',
    description: 'Teacher Gap Type',
    fields: {
        gapId: { type: GraphQLNonNull(GraphQLID) },
        position: { type: GraphQLNonNull(GraphQLInt) },
        options: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherOptionType))),
            resolve: async (parent, args, context) =>
                await optionController.getOptionsForTeacher(parent, args, context)
        },
        studentsAnswers: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentAnswerType))),
            resolve: async (parent, args, context) =>
                await gapService.getStudentsAnswers(parent.gapId)
        },
    }
});
