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

    async getAll({ sentenceId }) {
        const where = {};
        // if taskId is null, sentence will not have sentenceLessonSentence as child,
        // thus no need to require = true
        let required = false;
        if (sentenceId) {
            where.sentenceId = sentenceId;
            required = true;
        }

        return await Gap.findAll({
            include: {
                association: 'gapSentenceGap',
                include: {
                    association: 'sentenceGapSentence',
                    where,
                    required
                }
            }
        });
    }
}

module.exports = new GapService();
