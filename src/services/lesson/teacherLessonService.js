const {Teacher} = require("../../db/entities");

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
