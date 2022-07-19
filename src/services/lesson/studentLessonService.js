const {LessonStudent} = require("../../db/models");

class StudentLessonService {
    async studentLessonExists(lessonId, studentId){
        return !!await LessonStudent.count({
            where: {
                lessonId,
                studentId
            }
        });
    }
}

module.exports = new StudentLessonService();
