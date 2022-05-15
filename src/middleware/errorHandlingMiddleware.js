const {BaseError} = require("../utils");
const {GraphQLError} = require("graphql");
const {ApolloError} = require("apollo-server");

module.exports = (err) => {
    if (!(err?.originalError instanceof BaseError)) {
        console.error(err);
    }

    err.status = err?.originalError?.statusCode || 500;

    return err;
};
