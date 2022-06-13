const { Sentence } = require("../../db/models");
const {sentenceService, studentService} = require("../../services");
const {ValidationError} = require("../../utils");

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

    /**
     * Returns all sentences in the form of question-options by taskId
     * @param taskId
     * @return {Promise<*[]>} all question-options sentences by task id
     */
    async getAllQA({ taskId }) {
        return await sentenceService.getAllQA(taskId);
    }

    /**
     * Returns all sentences with answers entered by specific student, used in plain input and multiple choice
     * @param taskId
     * @param userId got from context
     * @return {Promise<Model[]>} all sentences with one student's answers by task id
     */
    async getAllWithAnswerSheetByTaskId({ taskId }, { user: { userId } }) {
        const student = await studentService.findOneByUserId(userId);
        if (!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await sentenceService.getAllWithAnswerSheetByTaskId(taskId, student.studentId);
    }
}

module.exports = new SentenceController();
