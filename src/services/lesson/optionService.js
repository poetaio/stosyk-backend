const { Option, StudentOption, sequelize, GET_TASK_TYPE_BY_OPTION_ID, GET_TASK_TYPE_BY_GAP_ID,
    GET_GAP_CORRECT_PLAIN_OPTIONS, GET_SOMETHING, matchingSentenceCorrectAnswersInclude, taskOptionsInclude, Gap,
    multipleGapsOptionsInclude, allOptionsBySentenceIdInclude
} = require("../../models");
const {TaskTypeEnum, ValidationError} = require("../../utils");
const Sequelize = require("sequelize");
const {taskGapsInclude} = require("../../models/includes/lesson/gap");

class OptionService {
    async create(value, isCorrect) {
        return await Option.create({ value, isCorrect });
    }

    async existsStudentAnswer(studentId, optionId) {
        return !!await StudentOption.count({
            where: { studentId, optionId }
        });
    }

    async existsStudentAnswerBySentenceId(studentId, sentenceId) {
        return !!await StudentOption.count({
            where: { studentId, sentenceId }
        });
    }

    async existsStudentAnswerBySentenceIdAndOptionId(studentId, sentenceId, optionId) {
        return !!await StudentOption.count({
            where: { studentId, sentenceId, optionId }
        });
    }

    async getAllForTeacher({ gapId }) {
        const where = {};
        // if taskId is null, sentence will not have sentenceLessonSentence as child,
        // thus no need to require = true
        let required = false;
        if (gapId) {
            where.gapId = gapId;
            required = true;
        }

        const [res] = await sequelize.query(GET_TASK_TYPE_BY_GAP_ID, {
            replacements: { gapId }
        });

        const taskType = res[0]?.type;

        if (taskType === TaskTypeEnum.MULTIPLE_CHOICE) {
            return await Option.findAll({
                include: {
                    association: 'optionGapOption',
                    include: {
                        association: 'gapOptionGap',
                        where,
                        required
                    },
                    required: true
                }
            });
        } else if (taskType === TaskTypeEnum.PLAIN_INPUT) {
            const [res] = await sequelize.query(GET_GAP_CORRECT_PLAIN_OPTIONS, {
                replacements: { gapId }
            });
            return res;
        }
        throw new ValidationError(`No such task type: ${taskType}`);
    }

    async getAllFromQuestionForTeacher(questionId) {
        return await Option.findAll({
            include: {
                association: 'optionGapOption',
                include: {
                    association: 'gapOptionGap',
                    include: {
                        association: 'gapSentenceGap',
                        include: {
                            association: 'sentenceGapSentence',
                            where: { sentenceId: questionId },
                            required: true,
                        },
                        required: true,
                    },
                    required: true
                },
                required: true
            }
        });
    }

    async getAllForStudent({ gapId }) {
        const where = {};
        // if taskId is null, sentence will not have sentenceLessonSentence as child,
        // thus no need to require = true
        let required = false;
        if (gapId) {
            where.gapId = gapId;
            required = true;
        }

        const [res] = await sequelize.query(GET_TASK_TYPE_BY_GAP_ID, {
            replacements: { gapId }
        });

        const taskType = res[0]?.type;

        if (taskType === TaskTypeEnum.MULTIPLE_CHOICE) {
            return await Option.findAll({
                include: {
                    association: 'optionGapOption',
                    include: {
                        association: 'gapOptionGap',
                        where,
                        required
                    },
                    required: true
                }
            });
        } else if (taskType === TaskTypeEnum.PLAIN_INPUT) {
            return [];
        }
        throw new ValidationError(`No such task type: ${taskType}`);
    }

    async getAllCorrectByGapId(gapId) {
        return await Option.findAll({
            where: { isCorrect: true },
            include: {
                association: 'optionGapOption',
                include: {
                    association: 'gapOptionGap',
                    where: {gapId},
                    required: true
                },
                required: true
            }
        });
    }

    async getAllWithAnswersByGapId(gapId) {
        return await Option.findAll({
            include: [
                {
                    association: 'optionGapOption',
                    include: {
                        association: 'gapOptionGap',
                        where: { gapId },
                        required: true
                    },
                    required: true
                },
                'optionStudents'
            ]
        });
    }

    async getOneStudentAnswerByGapId(gapId, studentId) {
        return await Option.findAll({
            include: [
                {
                    association: 'optionGapOption',
                    include: {
                        association: 'gapOptionGap',
                        where: { gapId },
                        required: true
                    },
                    required: true
                },
                {
                    association: 'optionStudents',
                    where: {studentId},
                    required: true
                }
            ]
        });
    }

    async existsByIdAndTaskId(optionId, taskId) {
        return !!await Option.count({
            where: { optionId },
            include: {
                association: "optionGapOption",
                include: {
                    association: "gapOptionGap",
                    include: {
                        association: "gapSentenceGap",
                        include: {
                            association: "sentenceGapSentence",
                            include: {
                                association: "sentenceTaskSentence",
                                include: {
                                    association: "taskSentenceTask",
                                    where: { taskId },
                                    required: true,
                                },
                                required: true,
                            },
                            required: true,
                        },
                        required: true,
                    },
                    required: true,
                },
                required: true,
            }
        });
    }

    async updateById(optionId, value, isCorrect) {
        return await Option.update(
            { value, isCorrect },
            {
                where: { optionId }
            }
        );
    }

    async getOneByGapIdAndStudentId(gapId, studentId) {
        return await Option.findOne({
            include: [{
                association: "optionStudents",
                where: { studentId },
                required: true
            }, {
                association: "optionGapOption",
                include: {
                    association: "gapOptionGap",
                    where: { gapId },
                    required: true,
                },
                required: true,
            }]
        });
    }

    async getAllWithStudentInputs({ gapId }) {

    }

    /**
     * Returns correct option for matching sentence
     * @param sentenceId
     * @returns {Promise<Model|null>} correct option
     */
    async getMatchingCorrectOption(sentenceId) {
        return await Option.findOne({
            include: matchingSentenceCorrectAnswersInclude(sentenceId),
            attributes: {
                include: [[Sequelize.col('optionGapOption.gapOptionGap.position'), 'rightColumnPosition']],
            },
            raw: true,
        });
    }

    /**
     * Returns "right column" for matching task
     * @param taskId
     * @returns {Promise<Model|null>} list of options available in task
     */
    async getAllMatchingRight(taskId) {
        const taskGaps = await Gap.findAll({
            include: taskGapsInclude(taskId),
            attributes: ["gapId"],
        });

        return await Option.findAll({
            include: multipleGapsOptionsInclude(taskGaps.map((gap) => gap.gapId)),
            attributes: ["optionId", "value"],
            order: [['optionGapOption', 'gapOptionGap', 'position', 'asc']],
        });
    }

    /**
     * Returns all students' answers for sentence in matching task type
     * @param sentenceId
     * @return {Promise<Model[]>} students' answers
     */
    async getStudentsMatchingAnswersBySentenceId(sentenceId) {
        return await StudentOption.findAll({
            where: { sentenceId },
            include: "option",
        });
    }

    /**
     * Returns all correct options by sentence id, used in matching task type
     * @param sentenceId
     * @return {Promise<Model[]>} correct options of sentence
     */
    async getCorrectOptionBySentenceId(sentenceId) {
        return await Option.findOne({
            where: { isCorrect: true },
            include: allOptionsBySentenceIdInclude(sentenceId)
        });
    }
}

module.exports = new OptionService();
