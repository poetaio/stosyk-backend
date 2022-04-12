module.exports = (err) => {
    console.error(err);
    return {
        message: err.message || 'Unknown error occurred',
        status: err?.originalError?.status || 500
    }
};
