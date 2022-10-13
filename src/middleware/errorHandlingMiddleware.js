const {logger} = require("../utils");
const {GraphQLError} = require("graphql");
const {ValidationError} = require("apollo-server-errors");

module.exports = (err) => {
    if (err?.originalError instanceof GraphQLError) {
        return err.originalError;
    }
    if (!(err instanceof ValidationError)) {
        logger.error(err);
        return err;
    }
    if (err.extensions?.exception) {
        err.extensions.exception = undefined;
    }
    return err;
};
