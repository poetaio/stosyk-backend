const httpStatusCodes = require("../httpStatusCodes");
const BaseError = require("./BaseError");

class DBError extends BaseError {
    constructor(message) {
        super('DB Error', httpStatusCodes.INTERNAL_SERVER, message);
    }
}

module.exports = DBError;
