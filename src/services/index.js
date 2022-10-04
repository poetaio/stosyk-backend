const lessonServices = require('./lesson')
const userServices = require('./user');
const pubsubService = require('./pubsubService');
const emailServices = require('./email');


module.exports = {
    ...lessonServices,
    ...userServices,
    ...emailServices,
    pubsubService
};
