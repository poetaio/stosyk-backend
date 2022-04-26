const { httpStatusCodes, UnauthorizedError, NotFoundError} = require("../utils");
const jwt = require('jsonwebtoken');

const parseRequest = async (userRoles, callback, parent, args, context) => {
    const { authHeader } = context;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        throw new UnauthorizedError('Invalid token');
    }

    let user;
    try {
        // parse token header -> user object
        user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        throw new UnauthorizedError(e.message);
    }

    // check role
    if (!userRoles.includes(user.role)) {
        throw new UnauthorizedError('Unauthorized');
    }

    // put user (id + role) to context
    context.user = user;
    return await callback(parent, args, context);
};

const resolveAuthMiddleware = (...userRoles) => {
    return (endpoint) => ({
        ...endpoint,
        // change resolve
        resolve: async (parent, args, context) => await parseRequest(userRoles, endpoint.resolve, parent, args, context),
    });
}

const subscribeAuthMiddleware = (...userRoles) => {
    return (endpoint) => ({
        ...endpoint,
        // change subscribe
        subscribe: async (parent, args, context) => await parseRequest(userRoles, endpoint.subscribe, parent, args, context),
    });
}

module.exports = {
    resolveAuthMiddleware,
    subscribeAuthMiddleware
}
