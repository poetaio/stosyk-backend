const { httpStatusCodes, UnauthorizedError, NotFoundError} = require("../utils");
const jwt = require('jsonwebtoken');


module.exports = (...userRole) => {
    return (endpoint) => ({
        ...endpoint,
        // change resolve
        resolve: async (parent, args, context) => {
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
            if (!userRole.includes(user.role)) {
                throw new UnauthorizedError('Unauthorized');
            }

            // put user (id + role) to context
            context.user = user;
            return await endpoint.resolve(parent, args, context);
        }
    })
};
