const errorHandlingMiddleware = require('./errorHandlingMiddleware');
const authMiddleware = require('./authMiddleware');


module.exports = {
    errorHandlingMiddleware,
    ...authMiddleware
};
