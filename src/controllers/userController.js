const userService = require('../services/userService');

class UserController {
    async get(args) {
        const userId = args.id;
        return await userService.getUserById(userId);
    }
}

module.exports = new UserController();
