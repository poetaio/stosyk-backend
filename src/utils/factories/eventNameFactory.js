const {EventNameEnum} = require("../enums");

class EventNameFactory {
    lessonStatusChangedEventName(lessonId, studentId) {
        return `${EventNameEnum.LESSON_STATUS_CHANGED}${lessonId}${studentId}`;
    }

    presentStudentsChangedEventName(lessonId, userId) {
        return `${EventNameEnum.PRESENT_STUDENTS_CHANGED}${lessonId}${userId}`;
    }

    studentsAnswersChangedEventName(lessonId, teacherId) {
        return `${EventNameEnum.STUDENTS_ANSWERS_CHANGED}${lessonId}${teacherId}`;
    }

    teacherShowedAnswersEventName(lessonId, studentId) {
        return `${EventNameEnum.TEACHER_SHOWED_ANSWERS}${lessonId}${studentId}`;
    }
}

module.exports = new EventNameFactory();
