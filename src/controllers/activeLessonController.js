const activeLessonService = require('../services/activeLessonService');
const ApiError = require('../error/ApiError');


class ActiveLessonController {
    async getActiveLessonById({ teacherId, activeLessonId }) {
        const activeLesson = await activeLessonService.getOneById(teacherId, activeLessonId);

        if (!activeLesson)
            throw ApiError.badRequest(`No active lesson with id ${activeLessonId}`);

        return activeLesson;
    }

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

    // test change for setup
    async studentChangedActiveLesson({ studentId }, { pubsub }) {
        await activeLessonService.studentChangedActiveLesson(pubsub, studentId);
    }

    // test change for setup
    async teacherChangedActiveLesson({ teacherId, teacherMessage }, { pubsub }) {
        await activeLessonService.teacherChangedActiveLesson(pubsub, teacherId, teacherMessage);
    }

    // test change for setup
    async subscribeToTeacherChangedActiveLesson({ studentId }, { pubsub }) {
        return await activeLessonService.subscribeToTeacherChangedActiveLesson(pubsub, studentId);
    }

    // test change for setup
    async subscribeToStudentChangedActiveLesson({ teacherId }, { pubsub }) {
        return await activeLessonService.subscribeToStudentChangedActiveLesson(pubsub, teacherId);
    }
}

module.exports = new ActiveLessonController();
