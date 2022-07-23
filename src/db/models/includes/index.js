const lessonIncludes = require('./lesson');
const sentenceIncludes = require('./lesson/sentence');

module.exports = {
    ...lessonIncludes,
    ...sentenceIncludes,
};
