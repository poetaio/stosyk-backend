const {GraphQLObjectType, GraphQLID, GraphQLNonNull} = require("graphql");
const ActiveOptionType = require('../ActiveOption.type');


module.exports = new GraphQLObjectType({
    name: "StudentAnswerSheetAnswerType",
    description: "Student Answer Sheet Answer Type",
    fields: {
        answerToId: { type: GraphQLNonNull(GraphQLID) },
        chosenOption: { type: ActiveOptionType }
    }
});
