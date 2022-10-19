const lessonServices = require('./lesson')
const userServices = require('./user');
const pubsubService = require('./pubsubService');
const emailServices = require('./email');
const paymentService = require('./paymentService')


module.exports = {
    ...lessonServices,
    ...userServices,
    ...emailServices,
    pubsubService,
    paymentService
};
