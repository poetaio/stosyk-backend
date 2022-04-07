const { User } = require('../models/index');

class UserService {
    async getUserById(userId) {
        return await User.findOne({ where: { id: userId } });
    }
}


module.exports = new UserService();
