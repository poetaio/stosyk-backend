const {StudentAnswerSheet} = require("../../models");
const StudentAnswerSheetStatus = require('../../models/lesson_active/utils/StudentAnswerSheetStatusEnum')

class StudentAnswerSheetService {
    async existsByLessonIdAndStudentId(activeLessonId, studentId) {
        return !!await StudentAnswerSheet.count({
            where: {
                activeLessonId,
                studentId
            }
        });
    }

    async existsActiveByLessonIdAndStudentId(activeLessonId, studentId) {
        return !!await StudentAnswerSheet.count({
            where: {
                activeLessonId,
                studentId,
                status: StudentAnswerSheetStatus.JOINED
            }
        });
    }

    async getOneByLessonIdAndStudentId(activeLessonId, studentId) {
        return await StudentAnswerSheet.findOne({
            where: {
                activeLessonId,
                studentId
            }
        });
    }

    async createOneByLessonIdAndStudentId(activeLessonId, studentId) {
        return await StudentAnswerSheet.create({
            activeLessonId,
            studentId
        });
    }

    async getStatusByActiveLessonIdAndStudent(activeLessonId, studentId) {
        return await StudentAnswerSheet.findOne({
            where: {
                activeLessonId: activeLessonId,
                studentId
            },
            attributes: ['status']
        }).then(({status}) => status);
    }

    async updateStatusByActiveLessonIdAndStudentId(activeLessonId, studentId, status) {
        return await StudentAnswerSheet.update({
            status
        }, {
            where: {
                activeLessonId,
                studentId
            }
        });
    }

    // async addAnswer(activeLessonId, studentId, taskId, gapId, optionId)
}

module.exports = new StudentAnswerSheetService();
