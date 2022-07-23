const lessonTypes = require('./lesson');
const taskTypes = require('./task');
const optionTypes = require('./option');


module.exports = {
    ...lessonTypes,
    ...taskTypes,
    ...optionTypes
};
