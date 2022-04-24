const ApiError = require("../error/ApiError");

module.exports = (req, res, err) => {
    if (!(err?.originalError instanceof ApiError))
        console.error(err);
    const status = err?.originalError?.status || 500;
    res.status(status);
    return {
        message: err.message || 'Unknown error occurred',
        status: status
    };
};
