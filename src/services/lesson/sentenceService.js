const {
    Sentence,
    SentenceGap,
    multipleChoiceSentenceCorrectAnswersByTaskIdInclude,
    plainInputSentencesCorrectAnswersByTaskIdInclude
} = require("../../models");
const gapService = require('./gapService');
const {
    allSentencesByTaskIdInclude,
    sentenceCorrectOptionsInclude
} = require("../../models/includes/lesson");
const {TaskTypeEnum} = require("../../utils");

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

    async getAllQA(taskId) {
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
    async getAllWithStudentsAnswersByTaskId(taskId) {
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

    // return task with correct options for each sentence-gap
    async getAllWithCorrectOptionsByTaskId(taskId, type) {
        const sentencesAnswers = [];
        let taskSentences;
        if (type === TaskTypeEnum.MULTIPLE_CHOICE) {
            taskSentences = await this.getMultipleChoiceSentencesCorrectAnswersByTaskId(taskId);
        } else if (type === TaskTypeEnum.PLAIN_INPUT) {
            taskSentences = await this.getPlainInputSentencesByTaskId(taskId);
        } else {
            throw new Error(`Unexpected task type: ${type}, taskId: ${taskId}`);
        }

        for (let { sentenceId, sentenceSentenceGaps } of taskSentences) {
            const newSentence = { sentenceId, gapsAnswers: [] };
            for (let { sentenceGapGap : gap } of sentenceSentenceGaps) {
                const newGap = { gapId: gap.gapId };
                newGap.correctAnswers = [];
                for (let { gapOptionOption : option } of gap.gapGapOptions) {
                    const { optionId, value, optionStudents } = option;
                    // if task type is plain input,
                    // then the correct option is which student didn't choose (optionStudents is empty)
                    if (type === TaskTypeEnum.PLAIN_INPUT && optionStudents.length)
                        continue;
                    newGap.correctAnswers.push({ optionId, value});
                }
                newSentence.gapsAnswers.push(newGap);
            }
            sentencesAnswers.push(newSentence);
        }

        return sentencesAnswers;

        // return await Sentence.findAll({
        //     include: [
        //         allSentencesByTaskIdInclude(taskId),
        //         sentenceCorrectOptionsInclude,
        //     ],
        // });
    }
}

module.exports = new SentenceService();
