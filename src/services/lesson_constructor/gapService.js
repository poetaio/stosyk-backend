const { Gap } = require('../../models');
const ApiError = require("../../error/ApiError");

class GapService {
    async existsById(id) {
        return !!await Gap.count({ where: { id } });
    }

    async getOneByIdShort(id) {
        return await Gap.findOne({ where: { id } });
    }

    async getOneByIdForTeacher(id) {
        return await Gap.findOne({ where: { id }, include: ['options', 'rightOption'] });
    }

    async getOneByIdForStudent(id) {
        return await Gap.findOne({ where: { id }, include: 'options' });
    }

    async createWithValues(taskId, gapPosition, options, rightOption) {
        const optionsWithValues = options.map((value) => ({ value }));
        const createdGap = await Gap.create({ gapPosition, taskId, options: optionsWithValues }, { include: 'options' });

        let rightOptionId;

        for (let { id, value } of createdGap.options) {
            if (value === rightOption) {
                rightOptionId = id;
                break;
            }
        }

        if (!rightOptionId)
            throw ApiError.badRequest(`No right option provided`);

        await createdGap.update({ rightOptionId });

        return createdGap;
    }
}

module.exports = new GapService();
