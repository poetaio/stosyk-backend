const { User } = require('../models/models');

class UserService {
    async getUserById(userId) {
        return await User.findOne({ where: { id: userId } });
    }
}


module.exports = new UserService();
