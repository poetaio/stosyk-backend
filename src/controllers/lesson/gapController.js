const { Gap } = require("../../models");
const {gapService} = require("../../services");

class GapController {
    async getGaps(parent, args, context) {
        return await gapService.getAll(parent);
    }

    async getStudentAnswer({ gapId }) {
        return {
            optionId: "sfsdfsdf",
            value: 'safsdf'
        };
    }
}

module.exports = new GapController();
