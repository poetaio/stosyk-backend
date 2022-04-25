const { Option } = require("../../models");

class OptionService {
    async create(value, isRight) {
        return await Option.create({ value, isRight });
    }
}

module.exports = new OptionService();
