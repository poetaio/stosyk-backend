const {LessonTeacher} = require("../../db/models");

class LessonTeacherService {
    async teacherLessonExists(lessonId, teacherId){
        return !!await LessonTeacher.count({
            where: {
                lessonId,
                teacherId
            }
        });
    }
}

module.exports = new LessonTeacherService();
