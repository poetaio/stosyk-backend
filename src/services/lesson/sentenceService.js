const { Sentence, SentenceGap, multipleChoiceSentenceCorrectAnswersByTaskIdInclude,
    plainInputSentencesCorrectAnswersByTaskIdInclude
} = require("../../models");
const gapService = require('./gapService');
const {Sequelize} = require("sequelize");
const { Op } = require("sequelize");
const {allSentencesByTaskIdInclude, sentenceGapsInclude} = require("../../models/includes/lesson");

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

    async getAll(taskId) {
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

    async getAllQA({taskId}) {
        const sentences = await Sentence.findAll({
            include: {
                association: 'sentenceTaskSentence',
                include: {
                    association: 'taskSentenceTask',
                    where: {taskId},
                    required: true
                },
                required: true
            }
        });

        const resSentences = [];

        for (let sentence of sentences) {
            resSentences.push({
                questionId: sentence.sentenceId,
                index: sentence.index,
                text: sentence.text,
            });
        }

        return resSentences;
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

    /**
     * Get all sentences with gaps and students answers for each gap
     * @param taskId
     * @returns sentenceId, gaps and students answers for each
     */
    async getSentencesWithAnswersByTaskId(taskId) {
        const sentences = await Sentence.findAll({
            include: [
                allSentencesByTaskIdInclude(taskId),
                "gaps",
            ],
        }).then(res => res.map(sentence => sentence.get({ plain: true })));

        for (let sentence of sentences) {
            for (let gap of sentence.gaps) {
                gap.studentsAnswers = await gapService.getStudentsAnswers(gap.gapId);
            }
        }

        return sentences;
    }
}

module.exports = new SentenceService();
