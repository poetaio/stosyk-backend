const taskGapsInclude = require('./taskGaps.include');
const allGapsByHWIdInclude = require('./allGapsByHWId.include');
const allAnsweredGapsByHWIdAndStudentIdInclude = require('./allAnsweredGapsByHWIdAndStudentId.include')
const allCorrectAnsweredGapsByHWIdAndStudentIdInclude = require('./allCorrectAnsweredGapsByHWId.include')
const allGapsWithAnswersShownInclude = require('./allGapsWithAnswersShown.include');

module.exports = {
    taskGapsInclude,
    allGapsByHWIdInclude,
    allAnsweredGapsByHWIdAndStudentIdInclude,
    allCorrectAnsweredGapsByHWIdAndStudentIdInclude,
    allGapsWithAnswersShownInclude,
};
