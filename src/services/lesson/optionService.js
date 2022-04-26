const { Option, StudentOption} = require("../../models");

class OptionService {
    async create(value, isRight) {
        return await Option.create({ value, isRight });
    }

    async existsStudentAnswer(studentId, optionId) {
        return !!await StudentOption.count({
            where: { studentId, optionId }
        });
    }

    async getAll({ gapId }) {
        const where = {};
        // if taskId is null, sentence will not have sentenceLessonSentence as child,
        // thus no need to require = true
        let required = false;
        if (gapId) {
            where.gapId = gapId;
            required = true;
        }

        return await Option.findAll({
            include: {
                association: 'optionGapOption',
                include: {
                    association: 'gapOptionGap',
                    where,
                    required
                }
            }
        });
    }
}

module.exports = new OptionService();
