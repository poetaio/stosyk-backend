const lessonIncludes = require('./lesson');
const sentenceIncludes = require('./sentence');

module.exports = {
    ...lessonIncludes,
    ...sentenceIncludes,
};
