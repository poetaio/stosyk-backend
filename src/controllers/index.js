const lessonControllers = require('./lesson');
const userControllers = require('./user');
const paymentController = require('./paymentController')


module.exports = {
    ...lessonControllers,
    ...userControllers,
    paymentController
};
