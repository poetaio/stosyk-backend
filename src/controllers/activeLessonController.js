const activeLessonService = require('../services/lesson_active/activeLessonService');
const ApiError = require('../error/ApiError');


class ActiveLessonController {
    async isLessonActive({ activeLessonId }) {
        return await activeLessonService.exists(activeLessonId);
    }

    async getActiveLessonByIdForTeacher({ teacherId, activeLessonId }) {
        const activeLesson = await activeLessonService.getOneByIdAndTeacherId(teacherId, activeLessonId);

        if (!activeLesson)
            throw ApiError.badRequest(`No active lesson with id ${activeLessonId}`);

        return activeLesson;
    }

    async createActiveLesson({ teacherId, lessonId }) {
        return await activeLessonService.create(teacherId, lessonId);
    }

    // returns activeLesson tasks and student's answer sheet
    async studentJoinLesson({ activeLessonId, studentId }, { pubsub }) {
        return await activeLessonService.studentJoinLesson(pubsub, activeLessonId, studentId);
    }

    async startActiveLesson({ activeLessonId, teacherId }, { pubsub }) {
        return await activeLessonService.startActiveLesson(pubsub, activeLessonId, teacherId);
    }

    async finishActiveLesson({ activeLessonId, teacherId }, { pubsub }) {
        return await activeLessonService.finishActiveLesson(pubsub, activeLessonId, teacherId);
    }

    async resumeActiveLesson({ activeLessonId, teacherId }, { pubsub }) {
        return await activeLessonService.resumeActiveLesson(pubsub, activeLessonId, teacherId);
    }

    async changeStudentAnswer({ studentId, gap: { lessonId, taskId, gapId }, optionId }, { pubsub }) {
        return await activeLessonService.changeStudentAnswer(pubsub, lessonId, taskId, gapId, optionId, studentId);
    }

    async subscribeStudentOnActiveLessonStatusChanged({ activeLessonId, studentId }, { pubsub }) {
        return await activeLessonService.subscribeStudentOnActiveLessonStatusChanged(pubsub, activeLessonId, studentId);
    }

    async subscribeTeacherOnStudentEnteredAnswer({ activeLessonId, teacherId }, { pubsub }) {
        return await activeLessonService.subscribeTeacherOnStudentEnterAnswer(pubsub, activeLessonId, teacherId);
    }
}

module.exports = new ActiveLessonController();
