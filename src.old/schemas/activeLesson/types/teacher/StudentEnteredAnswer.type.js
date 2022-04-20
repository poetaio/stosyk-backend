const {GraphQLNonNull, GraphQLID, GraphQLObjectType} = require("graphql");
const { StudentType } = require('../../../types');
const ActiveOptionType = require('../ActiveOption.type');

module.exports = new GraphQLObjectType({
    name: "StudentEnteredAnswerType",
    description: "Contains studentId, activeTaskId, activeGapId, activeOptionId",
    fields: {
        student: { type: GraphQLNonNull(StudentType) },
        activeTaskId: { type: GraphQLNonNull(GraphQLID) },
        activeGapId: { type: GraphQLNonNull(GraphQLID) },
        chosenOption: { type: GraphQLNonNull(ActiveOptionType) },
    }
});
