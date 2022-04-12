const { Account } = require('../models/index');

class UserService {
    async getUserById(userId) {
        return await Account.findOne({ where: { id: userId } });
    }
}

module.exports = new UserService();
