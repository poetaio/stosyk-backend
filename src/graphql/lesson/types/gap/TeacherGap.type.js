const {GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLID} = require("graphql");
const { TeacherOptionType } = require("../option");
const { optionController } = require("../../../../controllers");

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
        }
    }
});
