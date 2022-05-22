const lessonTypes = require('./lesson');
const taskTypes = require('./task');
const optionTypes = require('./option');
const QuestionInputType = require('./Question.input.type');
const TeacherQuestionType = require('./TeacherQuestion.type');
const answerTypes = require('./answer');
const QuestionCorrectAnswersType = require('./QuestionCorrectAnswers.type');
const QuestionStudentsAnswersType = require('./QuestionStudentsAnswers.type');
const StudentQuestionType = require('./StudentQuestion.type');
const AnswerSheetQuestionType = require('./AnswerSheetQuestion.type');


module.exports = {
    ...lessonTypes,
    ...taskTypes,
    ...optionTypes,
    ...answerTypes,
    QuestionInputType,
    TeacherQuestionType,
    StudentQuestionType,
    QuestionCorrectAnswersType,
    QuestionStudentsAnswersType,
    AnswerSheetQuestionType,
};
