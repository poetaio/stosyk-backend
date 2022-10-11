const {BaseError, logger} = require("../utils");

module.exports = (err) => {
    if (!(err?.originalError instanceof BaseError)) {
        logger.error(err);
    }

    err.status = err?.originalError?.statusCode || 500;

    return err;
};
