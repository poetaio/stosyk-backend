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
}

module.exports = new UserService();
