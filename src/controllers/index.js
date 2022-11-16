const lessonControllers = require('./lesson');
const userControllers = require('./user');
const paymentController = require('./paymentController')
const schoolControllers = require('./school')


module.exports = {
    ...lessonControllers,
    ...userControllers,
    ...schoolControllers,
    paymentController
};
