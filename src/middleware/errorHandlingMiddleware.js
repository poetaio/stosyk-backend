module.exports = (err) => ({
    message: err.message || 'Unknown error occurred',
    status: err?.originalError?.status || 500
});
