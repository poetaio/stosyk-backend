const {ValidationError} = require("../../utils");
const {
    teacherService,
    studentService,
    homeworkService,
} = require("../../services");

class HomeworkController {
    async addHomeworkToLesson(homework, { user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await homeworkService.addHomework(teacher.teacherId, homework);
    }

    async getAllForTeacher({ where }, { user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await homeworkService.getAllByLessonIdOrHomeworkIdForTeacher(teacher.teacherId, where);
    }

    async getAllForStudent({ where }, { user: { userId } }) {
        const student = await studentService.findOneByUserId(userId);

        if (!student)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await homeworkService.getAllByLessonIdOrHomeworkIdForStudent(student.studentId, where);
    }

    async getAllByLessonId({lessonId}) {
        return await homeworkService.getAllByLessonId(lessonId);
    }
}

module.exports = new HomeworkController();