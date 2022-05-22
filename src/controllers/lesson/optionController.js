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
    async getAllByQuestionId({questionId}) {
        return await optionService.getAllByQuestionId(questionId);
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
    async getMatchingStudentsAnswersBySentenceId({ sentenceId }) {
        return await optionService.getMatchingStudentsAnswersBySentenceId(sentenceId);
    }

    /**
     * used in QuestionSentenceCorrectAnswers, returns correct option for test sentence
     * @param questionId
     * @return {Promise<Model[]>} correct option for test sentence
     */
    async getQuestionCorrectOption({ questionId }) {
        return await optionService.getCorrectOptionBySentenceId(questionId);
    }

    async getQAStudentsAnswersBySentenceId({ questionId }) {
        return await optionService.getAllWithAnswersBySentenceId(questionId);
    }
}

module.exports = new OptionController();
