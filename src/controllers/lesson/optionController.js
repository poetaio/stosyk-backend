const {optionService, studentService} = require("../../services");
const {ValidationError} = require("../../utils");

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

    /**
     * Returns all students answers for specific question (sentence in qa type)
     * @param questionId
     * @return {Promise<*>} list of students' answers
     */
    async getQAStudentsAnswersBySentenceId({ questionId }) {
        return await optionService.getAllWithAnswersBySentenceId(questionId);
    }

    /**
     * Returns specific student chosen option for a *matching* sentence
     * @param sentenceId
     * @param userId got from context
     * @return {Promise<void>} chosen option of specific student
     */
    async getMatchingChosenOptionBySentenceId({ sentenceId }, { user: { userId } }) {
        const student = await studentService.findOneByUserId(userId);
        if (!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await optionService.getMatchingChosenOptionBySentenceId(sentenceId, student.studentId);
    }

    /**
     * Returns specific student chosen option for *question* sentence
     * @param questionId
     * @param userId
     * @return {Promise<void>} chosen option of specific student
     */
    async getQuestionChosenOptionByStudentId({ questionId }, { user: { userId } }) {
        const student = await studentService.findOneByUserId(userId);
        if (!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await optionService.getQuestionChosenOptionBySentenceId(questionId, student.studentId);
    }
}

module.exports = new OptionController();
