const {LessonTeacher, Lesson, allSchoolLessonsByTeacherIdInclude} = require("../../db/models");

class LessonTeacherService {
    async teacherLessonExists(lessonId, teacherId) {
        return !!await Lesson.count({
            where: { lessonId },
            include: allSchoolLessonsByTeacherIdInclude(teacherId),
        }) ||
        !!await LessonTeacher.count({
            where: {
                lessonId,
                teacherId
            }
        });
    }
}

module.exports = new LessonTeacherService();
