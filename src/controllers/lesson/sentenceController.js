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
     * Get sentences with sentenceId and students' answers for each gap in them
     * @param taskId
     * @return {Promise<any[]>} list of sentences with ids and gaps with students' answers
     */
    async getAllWithStudentsAnswersByTaskId({ taskId }) {
        // sentenceId, gaps {gapId, studentAnswers {studentId, option} }
        return await sentenceService.getAllWithStudentsAnswersByTaskId(taskId);
    }

    /**
     * Get sentences with sentenceId and correct options for each gap in them
     * @param taskId
     * @param type task type
     * @return {Promise<*>} list of all task sentences with correct options
     */
    async getAllWithCorrectOptionsByTaskId({ taskId, type }) {
        return await sentenceService.getAllWithCorrectOptionsByTaskId(taskId, type);
    }

    async getAllQA({ taskId }) {
        return await sentenceService.getAllQA(taskId);
    }
}

module.exports = new SentenceController();
