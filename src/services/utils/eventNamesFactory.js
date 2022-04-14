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

    // active lesson started/finished/resumed events
    activeLessonStatusChangedEventName(activeLessonId, studentId) {
        return `${EventNames.ACTIVE_LESSON_STATUS_CHANGED}${activeLessonId}${studentId}`;
    }

    // active lesson student enter answer event
    activeLessonStudentEnterAnswerEvent(activeLessonId) {
        return `${EventNames.STUDENT_ENTERED_ANSWER}${activeLessonId}`;
    }

    // active lesson teacher showed answer event
    activeLessonTeacherShowedHidAnswerEventName(activeLessonId) {
        return `${EventNames.RIGHT_ANSWER_SHOWN}${activeLessonId}`;
    }

    // active lesson student joined/left lesson event
    activeLessonStudentJoinedLeftLessonEvent(activeLessonId) {
        return `${EventNames.STUDENT_JOINED_LEFT_LESSON}${activeLessonId}`;
    }
}

module.exports = new EventNamesFactory();
