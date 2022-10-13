const {GraphQLError} = require("graphql");

class UnauthorizedError extends GraphQLError {
    constructor(message, errorCode) {
        super(message, {
            extensions: {
                errorCode: errorCode || 3000,
                errorName: "Unauthorized Error"
            }
        });
    }
}

module.exports = UnauthorizedError;
