const lessonControllers = require('./lesson');
const userControllers = require('./user');


module.exports = {
    ...lessonControllers,
    ...userControllers,
};
