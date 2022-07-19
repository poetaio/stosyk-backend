const {NotFoundError, ValidationError} = require("../../utils");
const {Homework, TaskList, homeworkByTeacherIdInclude} = require("../../db/models");
const taskService = require("./taskService");
const lessonService = require("./lessonService");
const lessonTeacherService = require("./lessonTeacherService");
const studentLessonService = require("./studentLessonService");

class HomeworkService {
    async addHomework(teacherId, { lessonId, homework: { tasks } }) {
        // if lesson doesn't belong to teacher or it doesn't exist
        if (!await lessonTeacherService.teacherLessonExists(lessonId, teacherId)) {
            throw new NotFoundError(`No lesson ${lessonId} found of teacher ${teacherId}`);
        }

        const newHomework = await Homework.create({ lessonId });
        const taskList = await TaskList.create({homeworkId: newHomework.homeworkId});
        await taskService.createTaskListTasks(taskList.taskListId, tasks);
        return newHomework.homeworkId;
    }

    async getAllByLessonIdOrHomeworkIdForTeacher(teacherId, {homeworkId, lessonId}) {
        const where = {};
        if (!homeworkId && !lessonId) {
            throw new ValidationError(`No homeworkId and lessonId specified`);
        }
        // teacher must also own the lesson homework belongs to
        if (homeworkId) {
            where.homeworkId = homeworkId;
        }
        if (lessonId) {
            if (!await lessonTeacherService.teacherLessonExists(lessonId, teacherId)) {
                throw new NotFoundError(`No lesson ${lessonId} found of teacher ${teacherId}`);
            }
            where.lessonId = lessonId;
        }

        return await Homework.findAll({
            where,
            // teacher cannot only get homework which belongs to lesson he created
            include: homeworkByTeacherIdInclude(teacherId)
        });
    }

    async getAllByLessonIdOrHomeworkIdForStudent(studentId, {homeworkId, lessonId}) {
        const where = {};
        if (!homeworkId && !lessonId) {
            throw new ValidationError(`No homeworkId and lessonId specified`);
        }
        // student can get homework only by homework id
        if (homeworkId) {
            where.homeworkId = homeworkId;
        }
        if (lessonId) {
            if (!await studentLessonService.studentLessonExists(lessonId, studentId)) {
                throw new NotFoundError(`No lesson ${lessonId} found of student ${studentId}`);
            }
            where.lessonId = lessonId;
        }

        return await Homework.findAll({
            where,
        });
    }

    async getAllByLessonId(lessonId) {
        return await Homework.findAll({
            where: { lessonId },
        });
    }
}

module.exports = new HomeworkService();
