const httpStatusCodes = require("../httpStatusCodes");
const BaseError = require("./BaseError");

class ValidationError extends BaseError {
    constructor(message, field, value) {
        super('Validation Error', httpStatusCodes.BAD_REQUEST, message);
        this.field = field;
        this.value = value;
    }
}

module.exports = ValidationError;
