const {EventNameEnum} = require("../enums");

class EventNameFactory {
    lessonStartedEventName(lessonId) {
        return `${EventNameEnum.LESSON_STATUS_CHANGED}${lessonId}`;
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
    studentCurrentPositionChangedEventName(lessonId, teacherId) {
        return `${EventNameEnum.STUDENT_CURRENT_POSITION}${lessonId}${teacherId}`;
    }
}

module.exports = new EventNameFactory();
