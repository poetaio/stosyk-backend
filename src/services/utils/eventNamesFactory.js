const EventNames = require('./EventNamesEnum');


class EventNamesFactory {
    // test change for setup
    teacherChangedLessonEventName(activeLessonId) {
        return `${EventNames.TEACHER_CHANGED_LESSON}${activeLessonId}`;
    }

    // test change for setup
    studentChangedLessonEventName(activeLessonId) {
        return `${EventNames.STUDENT_CHANGED_LESSON}${activeLessonId}`;
    }
}

module.exports = new EventNamesFactory();
