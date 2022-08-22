const {Teacher} = require("../../db/models");

class TeacherLessonService {
    async getLessonTeacher(lessonId) {
        return await Teacher.findOne({
            include: {
                association: 'teacherLessonTeachers',
                attributes: [],
                where: { lessonId },
                required: true
            }
        });
    }
}

module.exports = new TeacherLessonService();
