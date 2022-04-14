const {GraphQLObjectType, GraphQLString, GraphQLNonNull} = require("graphql");
const StudentAnswerSheetType = require("./StudentAnswerSheet.type");
const StudentActiveLessonType = require("./StudentActiveLesson.type");

module.exports = new GraphQLObjectType({
    name: "ActiveLessonStatusChangedType",
    description: "ActiveLessonStatusChangedType contains status",
    fields: {
        status: { type: GraphQLNonNull(GraphQLString) },
        answerSheet: { type: StudentAnswerSheetType },
        activeLesson: { type: StudentActiveLessonType }
    }
});
