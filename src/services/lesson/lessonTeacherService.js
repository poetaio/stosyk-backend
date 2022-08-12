const {
    LessonTeacher,
    Lesson,
    allLessonTeacherByLessonIdInclude,
    allLessonsByTeacherIdInclude,
    allSchoolLessonsByTeacherIdInclude,
} = require("../../db/models");
const {ValidationError} = require("../../utils");

class LessonTeacherService {
    async teacherLessonExists(lessonId, teacherId) {
        return !!await Lesson.count({
            where: { lessonId },
            include: allSchoolLessonsByTeacherIdInclude(teacherId),
        }) ||
        !!await LessonTeacher.count({
            where: {
                teacherId,
                lessonId,
            }
        })
    }

    /**
     * Lesson is either started or is protege - doesn't matter
     * it's been created by teacher
     */
    async lessonBelongsToTeacher(lessonId, teacherId) {
        return !!await Lesson.count({
            include: allLessonsByTeacherIdInclude(teacherId),
            where: {lessonId},
        });
    }

    async teacherMarkupLessonExists(lessonMarkupId, teacherId) {
        return !!await LessonTeacher.count({
            where: {
                lessonMarkupId,
                teacherId,
            }
        });
    }
}

module.exports = new LessonTeacherService();
