const lessonServices = require('./lesson')
const userServices = require('./user');


module.exports = {
    ...lessonServices,
    ...userServices
};
