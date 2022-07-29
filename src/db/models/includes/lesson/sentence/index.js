const multipleChoiceSentenceCorrectAnswersByTaskIdInclude = require('./multipleChoiceSentenceCorrectAnswersByTaskId.include');
const plainInputSentencesCorrectAnswersByTaskIdInclude = require('./plainInputSentencesCorrectAnswersByTaskId.include');
const sentenceStudentAnswersInclude = require('./sentenceStudentAnswers.include');
const allSentencesByTaskIdInclude = require('./allSentencesByTaskId.include');
const sentenceGapsInclude = require('./sentenceGaps.include');
const sentenceCorrectOptionsInclude = require('./sentenceCorrectOptions.include');
const sentenceGapsNewInclude = require('./sentenceGapsNew.include.js');
const allSentencesByHWIdInclude = require('./allSentencesByHWId.include');
const allAnsweredSentencesByHWIdAndStudentIdInclude = require('./allAnsweredSentencesByHWIdAndStudentId.include');
const allCorrectAnsweredSentencesByHWIdAndStudentIdInclude = require('./allCorrectAnsweredSentencesByHWIdAndStudentId.include');

module.exports = {
    multipleChoiceSentenceCorrectAnswersByTaskIdInclude,
    plainInputSentencesCorrectAnswersByTaskIdInclude,
    sentenceStudentAnswersInclude,
    allSentencesByTaskIdInclude,
    sentenceGapsInclude,
    sentenceGapsNewInclude,
    sentenceCorrectOptionsInclude,
    allSentencesByHWIdInclude,
    allAnsweredSentencesByHWIdAndStudentIdInclude,
    allCorrectAnsweredSentencesByHWIdAndStudentIdInclude,
};
