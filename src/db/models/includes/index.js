const lessonIncludes = require('./lesson');
const userIncludes = require('./user');

module.exports = {
    ...lessonIncludes,
    ...userIncludes,
};
