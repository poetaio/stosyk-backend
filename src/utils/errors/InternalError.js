const {GraphQLError} = require("graphql");

class InternalError extends GraphQLError {
    constructor(message, errorCode) {
        super(message, {
            extensions: {
                errorCode: errorCode || 6000,
                errorName: "Internal Error"
            }
        });
    }
}

module.exports = InternalError;
