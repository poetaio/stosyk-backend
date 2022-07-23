const {BaseError} = require("../utils");

module.exports = (req, res, err) => {
    if (!(err?.originalError instanceof BaseError))
        console.error(err);

    const status = err?.originalError?.statusCode || 500;
    res.status(status);

    return err;
};
