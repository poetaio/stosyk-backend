const {GraphQLObjectType, GraphQLNonNull} = require("graphql");
const {StudentType} = require("../../../types");
const ActiveOptionType = require('../ActiveOption.type');

module.exports = new GraphQLObjectType({
    name: "StudentAnswerType",
    description: "Student Answer Type",
    fields: {
        student: { type: GraphQLNonNull(StudentType) },
        chosenOption: { type: GraphQLNonNull(ActiveOptionType) }
    }
});
