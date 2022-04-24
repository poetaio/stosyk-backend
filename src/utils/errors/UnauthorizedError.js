const httpStatusCodes = require("../httpStatusCodes");
const BaseError = require("./BaseError");

class UnauthorizedError extends BaseError {
    constructor(message) {
        super('Unauthorized', httpStatusCodes.UNAUTHORIZED, message);
    }
}

module.exports = UnauthorizedError;
