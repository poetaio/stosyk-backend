const {UnauthorizedError, UserRoleEnum} = require("../utils");
const jwt = require('jsonwebtoken');

const parseRestRequest = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            throw new UnauthorizedError('Invalid token');
        }

        let user;
        // parse token header -> user object
        user = jwt.verify(token, process.env.JWT_SECRET);
        // check role
        if (!UserRoleEnum.TEACHER===(user.role)) {
            throw new UnauthorizedError('Unauthorized');
        }
    } catch (e) {
        return res.status(403).json(e.message);
    }

    return next();
}

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

const parseRequestForUserId = async (callback, parent, args, context) => {
    const {authHeader} = context;
    const token = authHeader?.split(' ')[1];

    if (token) {
        let user;
        try {
            // parse token header -> user object
            user = jwt.verify(token, process.env.JWT_SECRET);
            context.userId = user.userId;
        } catch (e) {
            return await callback(parent, args, context);
        }
    }
    return await callback(parent, args, context);
};

const resolveAuthMiddleware = (...userRoles) => {
    return (endpoint) => ({
        ...endpoint,
        // change resolve
        resolve: async (parent, args, context) => await parseRequest(userRoles, endpoint.resolve, parent, args, context),
    });
}

const resolveUserIdParsingMiddleware = (endpoint) => ({
        ...endpoint,
        // change resolve
        resolve: async (parent, args, context) => await parseRequestForUserId(endpoint.resolve, parent, args, context),
    });

const subscribeAuthMiddleware = (...userRoles) => {
    return (endpoint) => ({
        ...endpoint,
        // change subscribe
        subscribe: async (parent, args, context) => await parseRequest(userRoles, endpoint.subscribe, parent, args, context),
    });
}

module.exports = {
    resolveAuthMiddleware,
    subscribeAuthMiddleware,
    parseRestRequest,
    resolveUserIdParsingMiddleware
}
