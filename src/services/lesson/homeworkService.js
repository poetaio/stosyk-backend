const {NotFoundError, ValidationError, TaskTypeEnum} = require("../../utils");
const {Homework, TaskList, homeworkByTeacherIdInclude, allStudentsByHomeworkIdInclude, Student, Sentence,
    allGapsByHWIdInclude, allSentencesByHWIdInclude, allAnsweredSentencesByHWIdAndStudentIdInclude,
    allAnsweredGapsByHWIdAndStudentIdInclude, allCorrectAnsweredSentencesByHWIdAndStudentIdInclude,
    allCorrectAnsweredGapsByHWIdAndStudentIdInclude
} = require("../../db/models");
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

    async getStudents(homeworkId) {
        // all students who have at least one answer on any task of this homework
        return await Student.findAll({
            include: allStudentsByHomeworkIdInclude(homeworkId),
        });
    }

    async getMultipleChoicePlainInputTotalCount(homeworkId) {
        const types = [TaskTypeEnum.MULTIPLE_CHOICE, TaskTypeEnum.PLAIN_INPUT];

        return await Sentence.count({
            include: allGapsByHWIdInclude(homeworkId, types),
        });
    }

    async getMatchingQATotalCount(homeworkId) {
        const types = [TaskTypeEnum.MATCHING, TaskTypeEnum.QA];

        return await Sentence.count({
            include: allSentencesByHWIdInclude(homeworkId, types),
        });
    }

    // all tasks "subtasks" (answers in QA, or left column sentences in MATCHING)
    async getTotalCount(homeworkId) {
        const multipleChoiceAndPlainInputTotalCount = await this.getMultipleChoicePlainInputTotalCount(homeworkId);
        const matchingQATotalCount = await this.getMatchingQATotalCount(homeworkId);

        return multipleChoiceAndPlainInputTotalCount + matchingQATotalCount;
    }

    async getMultipleChoicePlainInputAnsweredCount(homeworkId, studentId) {
        const types = [TaskTypeEnum.MATCHING, TaskTypeEnum.QA];

        return await Sentence.count({
            include: allAnsweredGapsByHWIdAndStudentIdInclude(homeworkId, studentId, types),
        });
    }

    async getMatchingQAAnsweredCount(homeworkId, studentId) {
        const types = [TaskTypeEnum.MATCHING, TaskTypeEnum.QA];

        return await Sentence.count({
            include: allAnsweredSentencesByHWIdAndStudentIdInclude(homeworkId, studentId, types),
        });
    }

    // all tasks, which student answered to
    async getAnsweredCount(homeworkId, studentId) {
        const multipleChoiceAndPlainInputAnsweredCount = await this.getMultipleChoicePlainInputAnsweredCount(homeworkId, studentId);
        const matchingQAAnsweredCount = await this.getMatchingQAAnsweredCount(homeworkId, studentId);

        return multipleChoiceAndPlainInputAnsweredCount + matchingQAAnsweredCount;
    }

    async getMultipleChoicePlainInputCorrectAnsweredCount(homeworkId, studentId) {
        const types = [TaskTypeEnum.MATCHING, TaskTypeEnum.QA];

        return await Sentence.count({
            include: allCorrectAnsweredGapsByHWIdAndStudentIdInclude(homeworkId, studentId, types),
        });
    }

    async getMatchingQACorrectAnsweredCount(homeworkId, studentId) {
        const types = [TaskTypeEnum.MATCHING, TaskTypeEnum.QA];

        return await Sentence.count({
            include: allCorrectAnsweredSentencesByHWIdAndStudentIdInclude(homeworkId, studentId, types),
        });
    }

    // all tasks, which student answered correctly to
    async getCorrectAnsweredCount(homeworkId, studentId) {
        const multipleChoiceAndPlainInputCorrectAnsweredCount = await this.getMultipleChoicePlainInputCorrectAnsweredCount(homeworkId, studentId);
        const matchingQACorrectAnsweredCount = await this.getMatchingQACorrectAnsweredCount(homeworkId, studentId);

        return multipleChoiceAndPlainInputCorrectAnsweredCount + matchingQACorrectAnsweredCount;
    }

    async getStudentCompleteness(homeworkId, studentId) {
        const totalCount = await this.getTotalCount(homeworkId);
        const answeredCount = await this.getAnsweredCount(homeworkId, studentId);

        return answeredCount / totalCount * 100;
    }

    async getStudentScore(homeworkId, studentId) {
        const answeredCount = await this.getAnsweredCount(homeworkId, studentId);
        const correctCount = await this.getCorrectAnsweredCount(homeworkId, studentId);

        return correctCount / answeredCount * 100;
    }

    async getTotalScore(homeworkId, studentId) {
        const totalCount = await this.getTotalCount(homeworkId);
        const correctCount = await this.getCorrectAnsweredCount(homeworkId, studentId);

        return correctCount / totalCount * 100;
    }

    async homeworkExists(homeworkId) {
        return !!await Homework.count({
            where: { homeworkId },
        });
    }
}

module.exports = new HomeworkService();
