const subscribePublishService = require('./subscribePublishService');
const {ActiveLesson, StudentAnswerSheet} = require("../models");

class ActiveLessonService {
    async getActiveLessonByTeacherId(teacherId) {
        return ActiveLesson.findOne({ where: { teacherId } })
    }

    async getActiveLessonByStudentId(studentId) {
        return StudentAnswerSheet.findOne({ where: { studentId } })
    }

    // test change for setup
    async studentChangedActiveLesson(pubsub, studentId) {
        const activeLessonId = this.getActiveLessonByStudentId(studentId);

        await subscribePublishService.publishStudentChangedActiveLesson(pubsub, activeLessonId, { studentId });
    }

    // test change for setup
    async teacherChangedActiveLesson(pubsub, teacherId, teacherMessage) {
        const activeLessonId = this.getActiveLessonByTeacherId(teacherId);

        await subscribePublishService.publishTeacherChangedActiveLesson(pubsub,
            activeLessonId,
            { teacherChangedLesson: { message: teacherMessage } });
    }

    // test change for setup
    async subscribeToTeacherChangedActiveLesson(pubsub, studentId) {
        const activeLessonId = this.getActiveLessonByStudentId(studentId);

        return await subscribePublishService.subscribeToTeacherChangedActiveLesson(pubsub, activeLessonId);
    }

    // test change for setup
    async subscribeToStudentChangedActiveLesson(pubsub, teacherId) {
        const activeLessonId = this.getActiveLessonByTeacherId(teacherId);

        return await subscribePublishService.subscribeToStudentChangedActiveLesson(pubsub, activeLessonId);
    }
}

module.exports = new ActiveLessonService();
