module.exports = (err) => ({
    message: err.message || 'Unknown error occurred',
    status: (typeof err.originalError === "undefined") ? 500 : err.originalError.status || 500
});
