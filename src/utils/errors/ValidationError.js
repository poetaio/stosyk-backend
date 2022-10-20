const httpStatusCodes = require("../httpStatusCodes");
const BaseError = require("./BaseError");
const {GraphQLError} = require("graphql");

class ValidationError extends GraphQLError {
    constructor(message, errorCode) {
        super(message, {
            extensions: {
                errorCode: errorCode || 1000,
                errorName: "Validation Error"
            }
        });
    }
}

module.exports = ValidationError;
