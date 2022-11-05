const lessonIncludes = require('./lesson');
const userIncludes = require('./user');
const schoolIncludes = require('./school');

module.exports = {
    ...lessonIncludes,
    ...userIncludes,
    ...schoolIncludes,
};
