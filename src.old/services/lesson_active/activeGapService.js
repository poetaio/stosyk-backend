const { ActiveGap, Gap} = require('../../models');
const ApiError = require("../../error/ApiError");
const activeTaskService = require('./activeTaskService');
const activeOptionService = require("./activeOptionService");

class ActiveGapService {
    async existsById(id) {
        return !!await ActiveGap.count({ where: { id } });
    }

    async existsByIdAndTaskId(id, activeTaskId) {
        return !!await ActiveGap.count({ where: { id, activeTaskId} });
    }

    // options - [ value ]
    async createWithOptionsValues(activeTaskId, gapPosition, options, rightOption) {
        // if (!await activeTaskService.existsById(taskId))
        //     throw ApiError.badRequest(`No task with id ${taskId}`);
        let createdGap = await ActiveGap.create({ gapPosition, activeTaskId, options }, { include: 'options' });
        let rightOptionId;

        for (let {id, value} of createdGap.options) {
            if (value === rightOption.value) {
                rightOptionId = id;
                break;
            }
        }
        if (!rightOptionId)
            throw ApiError.badRequest(`No right option provided`);

        await createdGap.update({ rightOptionId });

        return createdGap;
    }

    // options - [ id ]
    async createWithOptionIds(taskId, { optionsIds, rightOptionId }) {
        throw new Error("Not implemented");
    }

    async isAnswerShown(id) {
        if (!await this.existsById(id))
            throw ApiError.badRequest(`No gap with id: ${id}`);

        return await ActiveGap.findOne({ where: { id } })
            .then(({ answerShown }) => answerShown);
    }

    async setAnswerShown(id, answerShown) {
        if (!await this.existsById(id))
            throw ApiError.badRequest(`No gap with id: ${id}`);

        return await ActiveGap.update({ answerShown }, { where: { id } })
    }
}

module.exports = new ActiveGapService();
