const {Teacher} = require("../../db/models");

class TeacherLessonService {
    async getLessonTeacher(lessonId) {
        return await Teacher.findOne({
            include: {
                association: 'lessons',
                attributes: [],
                required: true,
                where: { lessonId },
            }
        });
    }
}

module.exports = new TeacherLessonService();
