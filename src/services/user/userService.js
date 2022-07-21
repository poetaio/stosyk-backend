const {User} = require("../../db/models");

class UserService {
    async findOneByUserId(userId) {
        return await User.findOne({
            where:
                {
                    userId
                }
        });
    }

    async existsById(userId) {
        return !!await User.count({
            where: { userId }
        });
    }
}

module.exports = new UserService();
