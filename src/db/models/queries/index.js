const lessonQueries = require('./lessonQueries');
const taskQueries = require('./taskQueries');
const sentenceQueries = require('./sentenceQueries');
const gapQueries = require('./gapQueries');
const optionsQueries = require('./optionQueries');


module.exports = {
    ...lessonQueries,
    ...taskQueries,
    ...sentenceQueries,
    ...gapQueries,
    ...optionsQueries
};
