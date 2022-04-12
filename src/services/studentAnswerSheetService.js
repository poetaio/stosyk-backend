const {StudentAnswerSheet} = require("../models");

class StudentAnswerSheetService {
    async existsByLessonIdAndStudentId(activeLessonId, studentId) {
        return !!await StudentAnswerSheet.count({
            where: {
                activeLessonId: activeLessonId,
                studentId
            }
        });
    }

    async getOneByLessonIdAndStudentId(activeLessonId, studentId) {
        return await StudentAnswerSheet.findOne({
            where: {
                activeLessonId: activeLessonId,
                studentId
            }
        });
    }

    async createOneByLessonIdAndStudentId(activeLessonId, studentId) {
        return await StudentAnswerSheet.create({
            activeLessonId: activeLessonId,
            studentId
        });
    }

    // async addAnswer(activeLessonId, studentId, taskId, gapId, optionId)
}

module.exports = new StudentAnswerSheetService();
