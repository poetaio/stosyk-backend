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

    // returns lesson status,
    // if started -> activeLesson tasks & student's answer sheet
    async studentJoinLesson({ activeLessonId, studentId }, { pubsub }) {
        return await activeLessonService.studentJoinLesson(pubsub, activeLessonId, studentId);
    }

    async studentLeaveLesson({ activeLessonId, studentId }, { pubsub }) {
        return await activeLessonService.studentLeaveLesson(pubsub, activeLessonId, studentId);
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

    async changeStudentAnswer({ studentId, lessonId, answer: { optionId, taskId, gapId } }, { pubsub }) {
        return await activeLessonService.changeStudentAnswer(pubsub, lessonId, taskId, gapId, optionId, studentId);
    }

    async showTaskRightAnswers({ teacherId, activeLessonId, taskId }, { pubsub }) {
        return await activeLessonService.showAllRightAnswersForTask(pubsub, activeLessonId, taskId, teacherId);
    }

    async hideTaskRightAnswers({ teacherId, activeLessonId, taskId }, { pubsub }) {
        return await activeLessonService.hideAllRightAnswersForTask(pubsub, activeLessonId, taskId, teacherId);
    }

    async subscribeStudentOnActiveLessonStatusChanged({ activeLessonId, studentId }, { pubsub }) {
        return await activeLessonService.subscribeStudentOnActiveLessonStatusChanged(pubsub, activeLessonId, studentId);
    }

    async subscribeTeacherOnStudentEnteredAnswer({ activeLessonId, teacherId }, { pubsub }) {
        return await activeLessonService.subscribeTeacherOnStudentEnterAnswer(pubsub, activeLessonId, teacherId);
    }

    async subscribeStudentOnTeacherShowedHidRightAnswer({ activeLessonId, studentId }, {pubsub}) {
        return await activeLessonService.subscribeStudentOnTeacherShowedHidAnswer(pubsub, activeLessonId, studentId);
    }

    async subscribeOnStudentJoinedLeftLesson({ activeLessonId, userId }, { pubsub }) {
        return await activeLessonService.subscribeOnStudentJoinedLeftLesson(pubsub, activeLessonId, userId);
    }
}

module.exports = new ActiveLessonController();
