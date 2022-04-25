const {Gap, Option} = require("../../models");
const {optionService} = require("../../services");

class OptionController {
    // parent contains gapId
    async getOptions(parent, args, context) {
        return await optionService.getAll(parent)
    }
}

module.exports = new OptionController();
