const {Student} = require("../../db/models");
// todo: remove client function (change initialization order)
const {client} = require("../../db/redis");
const Sequelize = require("sequelize");

class StudentLessonService {
    async studentLessonExists(lessonId, studentId){
        return await client().sIsMember(lessonId, studentId);
    }

    async getLessonStudents(lessonId) {
        const studentIds = await client().sMembers(lessonId);

        return await Student.findAll({
            where: {studentId: studentIds},
            include: 'user',
            attributes: {
                include: [
                    [Sequelize.col('user.name'), 'name'],
                ],
            },
            raw: true,
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
