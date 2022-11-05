const { Sentence } = require("../../db/entities");
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
     */
    async getAllWithStudentsAnswersByTaskId({ taskId }) {
        // sentenceId, gaps {gapId, studentAnswers {studentId, option} }
        return await sentenceService.getAllWithStudentsAnswersByTaskId(taskId);
    }

    /**
     * Get sentences with sentenceId and correct options for each gap in them
     */
    async getAllWithCorrectOptionsByTaskId({ taskId, type }) {
        return await sentenceService.getAllWithCorrectOptionsByTaskId(taskId, type);
    }

    /**
     * Returns all sentences in the form of question-options by taskId
     */
    async getAllQA({ taskId }) {
        return await sentenceService.getAllQA(taskId);
    }

    /**
     * Returns all sentences with answers entered by specific student, used in plain input and multiple choice
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
