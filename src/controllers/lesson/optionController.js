const {optionService, studentService, sentenceService, gapService} = require("../../services");
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
     */
    async getMatchingCorrectOption({ sentenceId }) {
        return await optionService.getMatchingCorrectOption(sentenceId);
    }

    /**
     * used MatchingTeacherTaskType in resolve for right column
     */
    async getAllMatchingRight({ taskId }) {
        return await optionService.getAllMatchingRight(taskId);
    }

    /**
     * used in resolve for student options for sentence from left column
     */
    async getMatchingStudentsAnswersBySentenceId({ sentenceId }) {
        return await optionService.getMatchingStudentsAnswersBySentenceId(sentenceId);
    }

    /**
     * used in QuestionSentenceCorrectAnswers, returns correct option for test sentence
     */
    async getQuestionCorrectOption({ questionId }) {
        return await optionService.getCorrectOptionBySentenceId(questionId);
    }

    /**
     * Returns all students answers for specific question (sentence in qa type)
     */
    async getQAStudentsAnswersBySentenceId({ questionId }) {
        return await optionService.getAllWithAnswersBySentenceId(questionId);
    }

    /**
     * Returns specific student chosen option for a *matching* sentence
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
     */
    async getQuestionChosenOptionByStudentId({ questionId }, { user: { userId } }) {
        const student = await studentService.findOneByUserId(userId);
        if (!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await optionService.getQuestionChosenOptionBySentenceId(questionId, student.studentId);
    }

    async getMatchingCorrectOptionForStudent({ sentenceId }) {
        if (!await sentenceService.answersShown(sentenceId)) {
            return null;
        }

        return await optionService.getMatchingCorrectOption(sentenceId);
    }

    async getQuestionCorrectOptionForStudent({questionId}) {
        if (!await sentenceService.answersShown(questionId)) {
            return null;
        }

        return await optionService.getCorrectOptionBySentenceId(questionId);
    }

    async getCorrectOptionByGapId({gapId}) {
        if (!await gapService.answersShown(gapId)) {
            return null;
        }

        const correctOptions = await optionService.getAllCorrectByGapId(gapId);
        return correctOptions[0] || null;
    }
}

module.exports = new OptionController();
