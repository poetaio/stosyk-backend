const {StudentAnswerSheet} = require("../../models");
const StudentAnswerSheetStatus = require('../../models/lesson_active/utils/StudentAnswerSheetStatusEnum')
const { studentAnswerSheetInclude, studentAnswerSheetIfLessonStartedInclude } = require('../../models/includes');
const ActiveLessonStatusEnum = require('../../models/lesson_active/utils/ActiveLessonStatusEnum');


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

    // exists answer sheet and lesson started
    async existsActiveByLessonIdAndStudentIdAndLessonStarted(activeLessonId, studentId) {
        return !!await StudentAnswerSheet.count({
            where: {
                activeLessonId,
                studentId,
                status: StudentAnswerSheetStatus.JOINED
            },
            include: {
                association: 'activeLesson',
                required: true,
                where: {
                    status: ActiveLessonStatusEnum.STARTED
                }
            }
        });
    }

    async getOneByLessonIdAndStudentId(activeLessonId, studentId) {
        return await StudentAnswerSheet.findOne({
            where: {
                activeLessonId,
                studentId
            },
            include: studentAnswerSheetInclude
        });
    }

    // where lesson status is started and answer sheet status is joined
    async getOneActiveByLessonIdAndStudentIdIfLessonStarted(activeLessonId, studentId) {
        return await StudentAnswerSheet.findOne({
            where: {
                activeLessonId,
                studentId,
                status: StudentAnswerSheetStatus.JOINED
            },
            include: studentAnswerSheetIfLessonStartedInclude
        });
    }

    async createOneByLessonIdAndStudentId(activeLessonId, studentId) {
        return await StudentAnswerSheet.create({
            activeLessonId,
            studentId
        }, { include: studentAnswerSheetInclude });
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
