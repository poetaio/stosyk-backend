const {
    LessonTeacher,
    Lesson,
    allLessonsByTeacherIdInclude,
    allSchoolLessonsByTeacherIdInclude,
} = require("../../db/entities");

class LessonTeacherService {
    // todo: seems like these two are the same and
    //       condition LessonTeacher.count doesn't play any role
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
        });
    }

    /**
     * Lesson is either started or is protege - doesn't matter
     * it's been created by teacher
     */
    async protegeBelongsToTeacher(lessonId, teacherId) {
        return !!await Lesson.count({
            include: allLessonsByTeacherIdInclude(teacherId),
            where: {lessonId},
        }) || !!await Lesson.count({
            where: { lessonId },
            include: allSchoolLessonsByTeacherIdInclude(teacherId),
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
