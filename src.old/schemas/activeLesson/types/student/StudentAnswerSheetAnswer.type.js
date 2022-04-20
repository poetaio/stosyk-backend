const {GraphQLObjectType, GraphQLNonNull} = require("graphql");
const ActiveOptionType = require('../ActiveOption.type');
const StudentAnswerToType = require('./StudentAnswerTo.type');


module.exports = new GraphQLObjectType({
    name: "StudentAnswerSheetAnswerType",
    description: "Student Answer Sheet Answer Type",
    fields: {
        // currently, gap type without right option
        answerTo: { type: GraphQLNonNull(StudentAnswerToType) },
        chosenOption: { type: GraphQLNonNull(ActiveOptionType) }
    }
});
