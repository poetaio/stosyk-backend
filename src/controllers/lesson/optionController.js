const {optionService} = require("../../services");

class OptionController {
    // parent contains gapId
    async getOptionsForTeacher(parent, args, context) {
        return await optionService.getAllForTeacher(parent)
    }

    // parent contains gapId
    async getOptionsForStudent(parent, args, context) {
        return await optionService.getAllForStudent(parent)
    }

    // used in TeacherQuestionType in resolve for answers
    async getAllForTeacherQuestion({questionId}) {
        return await optionService.getAllFromQuestionForTeacher(questionId);
    }

    /**
     * used MatchingTeacherSentenceLeftType in resolve for correct option
     * @param sentenceId
     * @returns {Promise<Model|null>} correct option for this sentence
     */
    async getMatchingCorrectOption({ sentenceId }) {
        return await optionService.getMatchingCorrectOption(sentenceId);
    }

    /**
     * used MatchingTeacherTaskType in resolve for right column
     * @param taskId
     * @returns {Promise<Model|null>} all options available for task (to connect with left column)
     */
    async getAllMatchingRight({ taskId }) {
        return await optionService.getAllMatchingRight(taskId);
    }

    /**
     * used in resolve for student options for sentence from left column
     * @param sentenceId
     * @return {Promise<*>} return list of student answers
     */
    async getStudentsMatchingAnswersBySentenceId({ sentenceId }) {
        return await optionService.getStudentsMatchingAnswersBySentenceId(sentenceId);
    }

    /**
     * used in QuestionSentenceCorrectAnswers, returns correct option for test sentence
     * @param questionId
     * @return {Promise<Model[]>} correct option for test sentence
     */
    async getQuestionCorrectOption({ questionId }) {
        return await optionService.getCorrectOptionBySentenceId(questionId);
    }
}

module.exports = new OptionController();
