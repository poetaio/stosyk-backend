const {NotFoundError} = require("../../utils");
const {Homework, TaskList, homeworkByTeacherIdInclude} = require("../../db/models");
const taskService = require("./taskService");
const lessonService = require("./lessonService");

class HomeworkService {
    async addHomework(teacherId, { lessonId, homework: { tasks } }) {
        // if lesson doesn't belong to teacher or it doesn't exist
        if (!await lessonService.teacherLessonExists(lessonId, teacherId)) {
            throw new NotFoundError(`No lesson ${lessonId} found of teacher ${teacherId}`);
        }

        const newHomework = await Homework.create({ lessonId });
        const taskList = await TaskList.create({homeworkId: newHomework.homeworkId});
        await taskService.createTaskListTasks(taskList.taskListId, tasks);
        return newHomework.homeworkId;
    }

    async getAllByLessonId(teacherId, {homeworkId, lessonId}) {

        const where = {};
        if (homeworkId) {
            where.homeworkId = homeworkId;
        }
        if (lessonId) {
            if (!await lessonService.teacherLessonExists(lessonId, teacherId)) {
                throw new NotFoundError(`No lesson ${lessonId} found of teacher ${teacherId}`);
            }
            where.lessonId = lessonId;
        }

        return await Homework.findAll({
            where,
            include: homeworkByTeacherIdInclude(teacherId)
        });
    }
}

module.exports = new HomeworkService();
