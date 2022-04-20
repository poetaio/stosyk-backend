const ApiError = require("../error/ApiError");

module.exports = (err) => {
    if (!(err?.originalError instanceof ApiError))
        console.error(err);
    return {
        message: err.message || 'Unknown error occurred',
        status: err?.originalError?.status || 500
    }
};
