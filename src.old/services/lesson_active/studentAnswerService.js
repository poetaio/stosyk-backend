const { StudentAnswer } = require('../../models');


class StudentAnswerService {
    async existsByAnswerSheetIdAndActiveGapId(answerSheetId, answerToId) {
        return !!await StudentAnswer.count({ where: { answerSheetId, answerToId } });
    }

    async getOneByAnswerSheetIdAndActiveGapId(answerSheetId, answerToId) {
        return await StudentAnswer.findOne({ where: { answerSheetId, answerToId }, include: 'chosenOption' });
    }

    // returns true if updated or created
    async createOrUpdateIfExists(answerSheetId, answerToId, chosenOptionId) {
        // if not exist create one
        if (!await this.existsByAnswerSheetIdAndActiveGapId(answerSheetId, answerToId)) {
            await StudentAnswer.create({answerSheetId, answerToId, chosenOptionId});
            return true;
        }

        const currentAnswer = await this.getOneByAnswerSheetIdAndActiveGapId(answerSheetId, answerToId);

        if (currentAnswer.chosenOptionId === chosenOptionId)
            return false;

        await StudentAnswer.update(
            { chosenOptionId },
            { where: { answerSheetId, answerToId } }
        );

        return true;
    }
}

module.exports = new StudentAnswerService();
