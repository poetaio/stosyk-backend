const {Gap, GapOption, gapExistsByGapIdAndStudentIdInclude} = require("../../models");
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

    async existsStudentAnswer(gapId, studentId) {
        return !!await Gap.count({
            where: { gapId },
            include: {
                association: "gapGapOptions",
                include: {
                    association: "gapOptionOption",
                    include: {
                        association: "optionStudents",
                        where: { studentId },
                        required: true
                    },
                    required: true
                },
                required: true
            }
        });
    }

    async create(position, options) {
        const gap = await Gap.create({ position });

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
        const options = await optionService.getAllWithAnswersByGapId(gapId);
        const studentsAnswers = [];
        for (let { optionId, value, isCorrect, optionStudents } of options) {
            for (let { studentId } of optionStudents || []) {
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
        for (let { optionId, value, isCorrect, optionStudents } of options) {
            for (let { studentId } of optionStudents || []) {
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

    async existsStudentAnswer(gapId, studentId) {
        return !!await Gap.count({
            where: { gapId },
            include: {
                association: "gapGapOptions",
                include: {
                    association: "gapOptionOption",
                    include: {
                        association: "optionStudents",
                        where: { studentId },
                        required: true,
                    },
                    required: true,
                },
                required: true,
            }
        })
    }

    async getCorrectOptions(gapId) {
        return await optionService.getAllCorrectByGapId(gapId);
    }
}

module.exports = new GapService();
