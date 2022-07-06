const teacherService = require("../../services/user/teacherService");
const {ValidationError} = require("../../utils");
const {homeworkService} = require("../../services");

class HomeworkController {
    async addHomeworkToLesson(homework, { user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await homeworkService.addHomework(teacher.teacherId, homework);
    }

    async getAll({ where }, { user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await homeworkService.getAllByLessonId(teacher.teacherId, where);
    }
}

module.exports = new HomeworkController();