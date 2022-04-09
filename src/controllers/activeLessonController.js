const activeLessonService = require('../services/activeLessonService');


class ActiveLessonController {
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
