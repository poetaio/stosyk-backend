const { Sentence } = require("../../models");
const {sentenceService} = require("../../services");

class SentenceController {
    async getSentences({ taskId }, args, context) {
        return await sentenceService.getAll(taskId);
    }

    // returns left column of matching task type
    async getAllMatchingLeft({ taskId }) {
        return await sentenceService.getAll(taskId);
    }

    /**
     * Get sentences with sentenceId and answers for each gap in them
     * @param taskId
     * @returns {Promise<Model|null>} list of sentences with ids and gaps with answers
     */
    async getSentencesWithAnswersByTaskId({ taskId }) {
        // sentenceId, gaps {gapId, studentAnswers {studentId, option} }
        return await sentenceService.getSentencesWithAnswersByTaskId(taskId);
    }
}

module.exports = new SentenceController();
