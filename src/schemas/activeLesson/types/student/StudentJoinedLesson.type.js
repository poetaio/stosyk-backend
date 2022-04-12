// if not started
// if started
// if finished

// always return status

// if started -> return answer sheet and tasks

const {GraphQLObjectType} = require("graphql");
const StudentAnswerSheetType = require('./StudentAnswerSheet.type');
const StudentActiveLessonType = require("./StudentActiveLesson.type");

module.exports = new GraphQLObjectType({
    name: "StudentJoinedLessonType",
    description: "Contains either inactive lesson(status+id) or both active lesson and student answer sheet",
    fields: {
        answerSheet: { type: StudentAnswerSheetType },
        activeLesson: { type: StudentActiveLessonType }
    }
})

