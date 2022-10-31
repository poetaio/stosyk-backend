const {GraphQLError} = require("graphql");

class BaseError extends GraphQLError {
    constructor(name, errorCode, message) {
        super(message, {
            extensions: { errorCode },
        });

        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.errorCode = errorCode;
        this.message = message;
        Error.captureStackTrace(this);
    }
}

module.exports = BaseError;
