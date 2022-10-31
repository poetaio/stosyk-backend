const httpStatusCodes = require("../httpStatusCodes");
const BaseError = require("./BaseError");
const {GraphQLError} = require("graphql");

class NotFoundError extends GraphQLError {
    constructor(message, errorCode) {
        super(message, {
            extensions: {
                errorCode: errorCode || 4000,
                errorName: "Not Found Error"
            }
        });
    }
}

module.exports = NotFoundError;
