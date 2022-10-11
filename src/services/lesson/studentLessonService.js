const {LessonStudent, Student} = require("../../db/models");
// todo: remove client function (change initialization order)
const {client} = require("../../db/redis");

class StudentLessonService {
    async studentLessonExists(lessonId, studentId){
        return await client().sIsMember(lessonId, studentId);
    }

    async getLessonStudents(lessonId) {
        const studentIds = await client().sMembers(lessonId);

        return await Student.findAll({
            where: {studentId: studentIds}
        })
    }

    async joinLesson(studentId, lessonId) {
        await client().sAdd(lessonId, studentId);
    }

    async leaveLesson(studentId, lessonId) {
        await client().sRem(lessonId, studentId);
    }

    async removeAllStudents(lessonId) {
        await client().del(lessonId);
    }
}

module.exports = new StudentLessonService();
