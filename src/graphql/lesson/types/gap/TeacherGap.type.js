const {GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLID} = require("graphql");
const { TeacherOptionType, StudentAnswerType} = require("../option");
const { optionController } = require("../../../../controllers");
const {gapService} = require("../../../../services");

module.exports = new GraphQLObjectType({
    name: 'TeacherGapType',
    description: 'Teacher Gap Type',
    fields: {
        gapId: { type: new GraphQLNonNull(GraphQLID) },
        position: { type: new GraphQLNonNull(GraphQLInt) },
        options: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TeacherOptionType))),
            resolve: async (parent, args, context) =>
                await optionController.getOptionsForTeacher(parent, args, context)
        },
        studentsAnswers: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentAnswerType))),
            resolve: async (parent, args, context) =>
                await gapService.getStudentsAnswers(parent.gapId)
        },
    }
});
