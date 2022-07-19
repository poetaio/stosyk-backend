const {ValidationError} = require("../../utils");
const {
    teacherService,
    studentService,
    homeworkService,
} = require("../../services");
const {Student} = require("../../db/models");

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

    async getStudents({ homeworkId }) {
        return await homeworkService.getStudents(homeworkId);
    }

    // complete = answered / correct
    async getStudentCompleteness({ studentId, parent: {homeworkId} }) {
        return await homeworkService.getStudentCompleteness(homeworkId, studentId);
    }

    // correctness = correct / answered
    async getStudentCorrectness({ studentId, parent: {homeworkId} }) {
        return await homeworkService.getStudentScore(homeworkId, studentId);
    }

    // total score = correct / total
    async getTotalScore({ studentId, parent: {homeworkId} }) {
        return await homeworkService.getTotalScore(homeworkId, studentId);
    }
}

module.exports = new HomeworkController();