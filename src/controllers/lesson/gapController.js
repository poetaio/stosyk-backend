const { Gap } = require("../../models");
const {gapService} = require("../../services");

class GapController {
    async getGaps(parent, args, context) {
        return await gapService.getAll(parent);
    }
}

module.exports = new GapController();
