const {Gap, GapOption, gapExistsByGapIdAndStudentIdInclude, gapStudentAnswersByStudentIdInclude,
    allGapsWithAnswersShownInclude
} = require("../../db/models");
const optionService = require('./optionService');

class GapService {
    // student is on lesson, which gap belongs to
    async existsByGapIdAndStudentId(gapId, studentId) {
        return !!await Gap.findOne({
            where: { gapId },
            attributes: ["gapId"],
            include: gapExistsByGapIdAndStudentIdInclude(studentId)
        });
    }

    /**
     * Returns true if student has chosen any option of this gap
     */
    async existsStudentAnswer(gapId, studentId) {
        return !!await Gap.count({
            where: { gapId },
            include: gapStudentAnswersByStudentIdInclude(studentId)
        });
    }

    async create(position, options) {
        const gap = await Gap.create({ position });

        // create option and connect to gap
        for (let { value, isCorrect } of options) {
            const newOption = await optionService.create(value, isCorrect);

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
                },
                required: true
            }
        });
    }

    async getStudentAnswer(gapId, studentId) {
        // todo: if option belongs to lesson student is on
        // if (!await this.existsByGapIdAndStudentId(gapId, studentId)) {
        //     throw new NotFoundError(`Gap of lesson of such student not found gapId: ${gapId}, studentId: ${studentId}`)
        // }

        const options = await optionService.getAllWithAnswersByGapId(gapId);
        for (let { optionId, value } of options) {
            if (await optionService.existsStudentAnswer(studentId, optionId)) {
                return {
                    optionId, value
                };
            }
        }

        return null;
    }

    async getStudentsAnswers(gapId) {
        const options = await optionService.getAllWithAnswersByGapId(gapId)
            .then(res => res.map(option => option.get({ plain: true })));
        const studentsAnswers = [];
        for (let { optionId, value, isCorrect, students } of options) {
            for (let { studentId } of students || []) {
                studentsAnswers.push({
                    option: {
                        optionId, value, isCorrect
                    },
                    studentId
                })
            }
        }
        return studentsAnswers;
    }

    async studentGetAnswer(gapId, studentId){
        const options = await optionService.getOneStudentAnswerByGapId(gapId, studentId);
        const studentsAnswers = [];
        for (let { optionId, value, isCorrect, students } of options) {
            for (let { studentId } of students || []) {
                studentsAnswers.push({
                    option: {
                        optionId, value, isCorrect
                    },
                    studentId
                })
            }
        }
        return studentsAnswers;
    }

    async getCorrectOptions(gapId) {
        return await optionService.getAllCorrectByGapId(gapId);
    }

    async answersShown(gapId) {
        return !!await Gap.count({
            include: allGapsWithAnswersShownInclude,
            where: {gapId},
        });
    }
}

module.exports = new GapService();
