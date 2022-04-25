const {Gap, GapOption} = require("../../models");
const optionService = require('./optionService');

class GapService {
    async create(position, options) {
        const gap = await Gap.create({ position });

        for (let { value, isRight } of options) {
            const newOption = await optionService.create(value, isRight);

            await GapOption.create({ gapId: gap.gapId, optionId: newOption.optionId });
        }

        return gap;
    }
}

module.exports = new GapService();
