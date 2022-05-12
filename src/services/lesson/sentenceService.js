const { Sentence, SentenceGap, multipleChoiceSentenceCorrectAnswersByTaskIdInclude,
    plainInputSentencesCorrectAnswersByTaskIdInclude
} = require("../../models");
const gapService = require('./gapService');
const {Sequelize} = require("sequelize");
const { Op } = require("sequelize");

class SentenceService {
    async create(index, text, gaps) {
        const sentence = await Sentence.create({ index, text });

        // create gap and connect to sentence
        for (let { position, options } of gaps) {
            const newGap = await gapService.create(position, options);

            await SentenceGap.create({ gapId: newGap.gapId, sentenceId: sentence.sentenceId });
        }

        return sentence;
    }

    async getAll({ taskId }) {
        const where = {};
        // if taskId is null, sentence will not have sentenceLessonSentence as child,
        // thus no need to require = true
        let required = false;
        if (taskId) {
            where.taskId = taskId;
            required = true;
        }

        return await Sentence.findAll({
            include: {
                association: 'sentenceTaskSentence',
                include: {
                    association: 'taskSentenceTask',
                    where,
                    required
                },
                required: true
            }
        });
    }

    async getPlainInputSentencesByTaskId(taskId) {
        return await Sentence.findAll({
            include: plainInputSentencesCorrectAnswersByTaskIdInclude(taskId)
        });
    }

    async getMultipleChoiceSentencesCorrectAnswersByTaskId(taskId) {
        return await Sentence.findAll({
            include: multipleChoiceSentenceCorrectAnswersByTaskIdInclude(taskId)
        });
    }
}

module.exports = new SentenceService();
