const {TaskTypeEnum} = require("../../utils");
const {
    Gap,
    allGapsByLessonIdInclude,
    Sentence,
    allSentencesByLessonIdInclude,
    allAnsweredGapsByLessonIdAndStudentIdInclude,
    allAnsweredSentencesByLessonIdAndStudentIdInclude,
    allCorrectAnsweredGapsByLessonIdAndStudentIdInclude,
    allCorrectAnsweredSentencesByLessonIdAndStudentIdInclude
} = require("../../db/entities");

class ScoreService {
    async getMultipleChoicePlainInputTotalCount(lessonId) {
        const types = [TaskTypeEnum.MULTIPLE_CHOICE, TaskTypeEnum.PLAIN_INPUT];

        return await Gap.count({
            include: allGapsByLessonIdInclude(lessonId, types),
        });
    }

    async getMatchingQATotalCount(lessonId) {
        const types = [TaskTypeEnum.MATCHING, TaskTypeEnum.QA];

        return await Sentence.count({
            include: allSentencesByLessonIdInclude(lessonId, types),
        });
    }

    // all tasks "subtasks" (answers in QA, or left column sentences in MATCHING)
    async getTotalCount(lessonId) {
        const multipleChoiceAndPlainInputTotalCount = await this.getMultipleChoicePlainInputTotalCount(lessonId);
        const matchingQATotalCount = await this.getMatchingQATotalCount(lessonId);

        return multipleChoiceAndPlainInputTotalCount + matchingQATotalCount;
    }

    async getMultipleChoicePlainInputAnsweredCount(lessonId, studentId) {
        const types = [TaskTypeEnum.MULTIPLE_CHOICE, TaskTypeEnum.PLAIN_INPUT];

        return await Gap.count({
            include: allAnsweredGapsByLessonIdAndStudentIdInclude(lessonId, studentId, types),
        });
    }

    async getMatchingQAAnsweredCount(lessonId, studentId) {
        const types = [TaskTypeEnum.MATCHING, TaskTypeEnum.QA];

        return await Sentence.count({
            include: allAnsweredSentencesByLessonIdAndStudentIdInclude(lessonId, studentId, types),
        });
    }

    // all tasks, which student answered to
    async getAnsweredCount(lessonId, studentId) {
        const multipleChoiceAndPlainInputAnsweredCount = await this.getMultipleChoicePlainInputAnsweredCount(lessonId, studentId);
        const matchingQAAnsweredCount = await this.getMatchingQAAnsweredCount(lessonId, studentId);

        return multipleChoiceAndPlainInputAnsweredCount + matchingQAAnsweredCount;
    }

    async getMultipleChoicePlainInputCorrectAnsweredCount(lessonId, studentId) {
        const types = [TaskTypeEnum.MULTIPLE_CHOICE, TaskTypeEnum.PLAIN_INPUT];

        return await Gap.count({
            include: allCorrectAnsweredGapsByLessonIdAndStudentIdInclude(lessonId, studentId, types),
        });
    }

    async getMatchingQACorrectAnsweredCount(lessonId, studentId) {
        const types = [TaskTypeEnum.MATCHING, TaskTypeEnum.QA];

        return await Sentence.count({
            include: allCorrectAnsweredSentencesByLessonIdAndStudentIdInclude(lessonId, studentId, types),
        });
    }

    // all tasks, which student answered correctly to
    async getCorrectAnsweredCount(lessonId, studentId) {
        const multipleChoiceAndPlainInputCorrectAnsweredCount = await this.getMultipleChoicePlainInputCorrectAnsweredCount(lessonId, studentId);
        const matchingQACorrectAnsweredCount = await this.getMatchingQACorrectAnsweredCount(lessonId, studentId);

        return multipleChoiceAndPlainInputCorrectAnsweredCount + matchingQACorrectAnsweredCount;
    }

    async getStudentProgress(lessonId, studentId) {
        const totalCount = await this.getTotalCount(lessonId);
        const answeredCount = await this.getAnsweredCount(lessonId, studentId);

        if (!totalCount) {
            return null;
        }

        return answeredCount / totalCount * 100;
    }

    async getStudentScore(lessonId, studentId) {
        const answeredCount = await this.getAnsweredCount(lessonId, studentId);
        const correctCount = await this.getCorrectAnsweredCount(lessonId, studentId);

        if (answeredCount === 0) {
            return null;
        }

        return correctCount / answeredCount * 100;
    }

    async getTotalScore(lessonId, studentId) {
        const totalCount = await this.getTotalCount(lessonId);
        const correctCount = await this.getCorrectAnsweredCount(lessonId, studentId);

        if (!totalCount) {
            return null;
        }

        return correctCount / totalCount * 100;
    }
}

module.exports = new ScoreService();
