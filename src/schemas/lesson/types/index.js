const lessonTypes = require('./lesson');
const taskTypes = require('./task');
const optionTypes = require('./option');
const QuestionInputType = require('./Question.input.type');
const QuestionType = require('./Question.type');
const answerTypes = require('./answer');
const QuestionCorrectAnswersType = require('./QuestionCorrectAnswers.type');


module.exports = {
    ...lessonTypes,
    ...taskTypes,
    ...optionTypes,
    ...answerTypes,
    QuestionInputType,
    QuestionType,
    QuestionCorrectAnswersType,
};
