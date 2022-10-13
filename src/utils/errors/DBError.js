const {GraphQLError} = require("graphql");

class DBError extends GraphQLError {
    constructor(message, errorCode) {
        super(message, {
            extensions: {
                errorCode: errorCode || 5000,
                errorName: "DB Internal Error"
            }
        });
    }
}

module.exports = DBError;
