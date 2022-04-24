const httpStatusCodes = require("../httpStatusCodes");
const BaseError = require("./BaseError");

class NotFoundError extends BaseError {
    constructor(message) {
        super('Unauthorized', httpStatusCodes.NOT_FOUND, message);
    }
}

module.exports = NotFoundError;
