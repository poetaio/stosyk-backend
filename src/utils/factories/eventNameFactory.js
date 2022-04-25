const {EventNameEnum} = require("../enums");

class EventNameFactory {
    lessonStatusChangedEventName(lessonId) {
        return `${EventNameEnum.LESSON_STATUS_CHANGED}${lessonId}`
    }

    presentStudentsChangedEventName(lessonId) {
        return `${EventNameEnum.PRESENT_STUDENTS_CHANGED}${lessonId}`
    }

    studentsAnswersChangedEventName(lessonId) {
        return `${EventNameEnum.STUDENTS_ANSWERS_CHANGED}${lessonId}`
    }

    teacherShowedAnswersEventName(lessonId) {
        return `${EventNameEnum.TEACHER_SHOWED_ANSWERS}${lessonId}`
    }
}

module.exports = new EventNameFactory();
