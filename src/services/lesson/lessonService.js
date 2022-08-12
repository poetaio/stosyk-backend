const {
    Lesson,
    LessonStudent,
    lessonInclude,
    lessonTasksInclude,
    Task,
    allTasksByLessonIdInclude,
    allLessonsBySchoolIdInclude,
    allSchoolLessonsByTeacherIdInclude,
    Gap,
    Sentence,
    allGapsByLessonIdInclude,
    allSentencesByLessonIdInclude,
    allAnsweredGapsByLessonIdAndStudentIdInclude,
    allAnsweredSentencesByLessonIdAndStudentIdInclude,
    allCorrectAnsweredGapsByLessonIdAndStudentIdInclude,
    allCorrectAnsweredSentencesByLessonIdAndStudentIdInclude,
} = require('../../db/models');
const {
    LessonStatusEnum,
    NotFoundError,
    ValidationError,
    TaskTypeEnum,
} = require('../../utils');
const teacherService = require('../user/teacherService');
const taskService = require('./taskService');
const pubsubService = require("../pubsubService");
const Sequelize = require('sequelize');
const studentService = require("../user/studentService");
const lessonAnswersService = require("./lessonAnswersService");
const {Op} = Sequelize;
const store = require("store2");
const lessonTeacherService = require('./lessonTeacherService');
const studentLessonService = require("./studentLessonService");
const markupService = require("./markupService");
const homeworkService = require("./homeworkService");
const {schoolService} = require("../school");
const teacherLessonService = require("./teacherLessonService");

class LessonService {
    async lessonExists(lessonId) {
        return !!await Lesson.count({
            where: {
                lessonId,
            }
        });
    }

    async existsActiveByLessonId(lessonId) {
        return !!await Lesson.count({
            where: {
                lessonId,
                status: LessonStatusEnum.ACTIVE
            }
        });
    }

    async existsPendingByLessonId(lessonId) {
        return !!await Lesson.count({
            where: {
                lessonId,
                status: LessonStatusEnum.PENDING
            }
        });
    }

    async deleteById(lessonId) {
        const lesson = await Lesson.findOne({
            where: {lessonId},
            include: lessonInclude
        });

        if (!lesson)
            return false;

        if (lesson.lessonTaskList) {
            for (let task of lesson.tasks || []) {
                for (let sentence of task.sentences || []) {
                    for (let gap of sentence.gaps || []) {
                        for (let option of option.gaps || []) {
                            await option.destroy();
                        }
                        await gap.destroy();
                    }
                    await sentence.destroy();
                }
                await task.destroy();
            }
        }

        // todo: delete attachments

        await lesson.destroy();

        return true;
    }

    async deleteByTeacherId(teacherId) {
        const markups = await LessonMarkup.findAll({
            where: {teacherId},
        });

        for (let markup of markups) {
            await markupService.deleteById(markup.lessonMarkupId);
        }

        return true;
    }

    async deleteBySchoolId(schoolId) {
        const lessons = await LessonMarkup.findAll({
            include: [
                allLessonsBySchoolIdInclude(schoolId),
                lessonInclude,
            ]
        })

        for (let lesson of lessons) {
            await this.deleteById(lesson.lessonId);
        }

        return true;
    }

    async checkTasks(tasks) {
        for (let task of tasks) {
            await taskService.checkForCorrectOptionPresence(task);
        }
    }

    async create({name, description, tasks, homework: homeworkList}, teacherId) {
        // check if correct option exists for every gap
        await this.checkTasks(tasks);

        const school = await schoolService.getOneByTeacherId(teacherId);

        // check if anonymous, then delete all existing lessons
        // todo: fix when merging editing
        // if (await teacherService.existsAnonymousById(teacherId))
        //     await this.deleteBySchoolId(school.schoolId);

        return await markupService.createMarkupAndProtege(school.schoolId, teacherId, name, description, tasks, homeworkList);
    }

    async getTeacherLessons(teacherId, whereParam, page, limit) {
        const {lessonId, name} = whereParam || {};

        // if id is specified we return both run and library(protege) lessons
        // otherwise only library
        if (lessonId) {
            const lesson = await this.getTeacherLesson(teacherId, lessonId);

            let lessons = [];

            if (lesson) {
                lessons.push(lesson);
            }

            return {
                lessons,
                total: lessons.length,
            };
        }

        let where = {};
        if (name) {
            where = Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('name')),
                {
                    [Op.like]: `%${name.toLowerCase()}%`
                }
            );
        }

        const options = {
            where,
            include: allSchoolLessonsByTeacherIdInclude(teacherId),
        };

        page = page && 1;
        if (limit && limit > 0) {
            options.offset = (page - 1) * limit;
        }

        // getting all teacher's markups
        const countedLessons = await LessonMarkup.findAndCountAll(options);
        const {count: total, rows} = countedLessons;

        // converting them to their proteges
        const lessons = await this.convertLessonMarkupsToProteges(rows);

        return {
            total,
            lessons,
        };
    }

    async getStudentLesson(lessonId, studentId) {
        if (!await studentLessonService.studentLessonExists(lessonId, studentId)) {
            throw new NotFoundError(`No lesson ${lessonId} of such student ${studentId} found`);
        }
        return await Lesson.findOne({
            where: {
                lessonId,
            }
        });
    }

    /*
        Markup-Lesson logic:
            For teacherLessons query we return already created proteges for markups.
            For startLesson mutation we accept id of protege from Lesson table,
            after starting this protege it's no longer protege so
            we create new one for the correspondent markup
     */
    async startLesson(pubsub, lessonId, teacherId) {
        await markupService.checkIfLessonIsProtegeAndBelongsToTeacher(lessonId, teacherId);

        if (await this.existsActiveByLessonId(lessonId)) {
            throw new ValidationError(`Lesson is already active lessonId: ${lessonId}`);
        }

        const upd = await Lesson.update({
            status: LessonStatusEnum.ACTIVE
        }, {
            where: {
                lessonId,
            }
        });

        await LessonTeacher.create({
            teacherId,
            lessonId,
        });

        if (upd[0]) {
            await pubsubService.publishLessonStarted(pubsub, lessonId, {
                lessonId: lessonId, status:'ACTIVE'
            });
        }

        /*
           creating new protege check markupService#getMarkupProtege for more details
         */
        const {lessonMarkupId, name, description, tasks} = await markupService.getMarkupWithTasksAndHomeworkByLessonId(lessonId);

        const homeworks = await homeworkService.getFullHomeworkByLessonId(lessonId);
        homeworks.forEach(homework => homework.tasks = homework.taskList.tasks);

        await markupService.createProtegeRawTasks(name, description, tasks, homeworks, lessonMarkupId);

        return true;
    }

    /**
     * Removes all students from lesson
     */
    async removeAllStudents(lessonId) {
        await LessonStudent.destroy({
            where: { lessonId },
        });
    }

    async finishLesson(pubsub, lessonId, teacherId) {
        if (!await lessonTeacherService.teacherLessonExists(lessonId, teacherId)) {
            throw new NotFoundError(`No lesson active ${lessonId} of such teacher ${teacherId}`);
        }

        const upd = await Lesson.update({
            status: LessonStatusEnum.PENDING
        }, {
            where: {
                lessonId
            }
        });

        // clean up
        // todo: test clean up
        // await studentLessonService.removeAllStudents(lessonId);
        // await optionService.removeAllStudentsAnswersByLessonId(lessonId);
        store.clear();

        return !!upd[0];
    }

    async joinLesson(pubsub, lessonId, studentId) {
        if (!await this.lessonExists(lessonId)) {
            throw new NotFoundError(`No lesson ${lessonId} found`);
        }

        if (await studentLessonService.studentLessonExists(lessonId, studentId)) {
            throw new ValidationError(`Student ${studentId} is already on lesson ${lessonId}`);
        }

        await studentLessonService.joinLesson(studentId, lessonId);

        const teacher = await teacherLessonService.getLessonTeacher(lessonId)
        const students = await studentLessonService.getLessonStudents(lessonId)
        for (let student of students) {
            await pubsubService.publishOnPresentStudentsChanged(pubsub, lessonId, student.userId, students)
        }
        await pubsubService.publishOnPresentStudentsChanged(pubsub, lessonId, teacher.userId, students)
        return true;
    }

    async deleteLesson(lessonId, teacherId) {
        await markupService.checkIfLessonIsProtegeAndBelongsToTeacher(lessonId, teacherId);

        if (await this.existsActiveByLessonId(lessonId)) {
            throw new ValidationError(`Cannot delete active lesson lessonId: ${lessonId}`);
        }

        return await this.deleteById(lessonId);
    }

    async getStudentsAnswers(lessonId) {
        const lesson = await Lesson.findOne({
            where: { lessonId },
            include: lessonTasksInclude
        });

        const tasks = [];

        for (let { taskListTaskTask : task } of lesson.lessonTaskList.taskListTaskListTasks) {
            const newTask = { taskId: task.taskId, type: task.type, sentences: [] };

            tasks.push(newTask);
        }

        return tasks;
    }

    async setStudentCurrentPosition(pubsub, lessonId, taskId, student) {
        if (!await studentLessonService.studentLessonExists(lessonId, student.studentId)) {
            throw new NotFoundError(`No lesson ${lessonId} of student ${student.studentId} found`);
        }

        // todo: use redis
        const studentsCurrentTask = store.get(lessonId);
        if (!studentsCurrentTask) {
            store(lessonId, [{taskId, student}])
        } else {
            if (studentsCurrentTask.find(el => el.student.studentId === student.studentId)) {
                const newStudentsCurrentTask = studentsCurrentTask.map((el) => ({
                    ...el,
                    taskId: (el.student.studentId === student.studentId) ? taskId : el.taskId
                }))
                store(lessonId, newStudentsCurrentTask)
            } else {
                store.add(lessonId, [{taskId, student}])
            }
        }

        const students = await studentLessonService.getLessonStudents(lessonId)
        for (let student of students) {
            await pubsubService.publishOnStudentPosition(pubsub, lessonId, student.userId, store.get(lessonId))
        }

        const teacher = await teacherService.findOneByLessonId(lessonId)
        await pubsubService.publishOnStudentPosition(pubsub, lessonId, teacher.userId, store.get(lessonId))

        return true;
    }

    async getStudentCurrentPosition(pubsub, lessonId, userId) {
        setTimeout(async () => await pubsubService.publishOnStudentPosition(pubsub, lessonId, userId,
            store.get(lessonId) || []), 0)
        return await pubsubService.subscribeOnStudentPosition(pubsub, userId, lessonId)
    }

    async subscribeOnStudentAnswersChanged(pubsub, lessonId, teacherId) {
        if (!await lessonTeacherService.teacherLessonExists(lessonId, teacherId)) {
            throw new NotFoundError(`No active lesson ${lessonId} of such teacher ${teacherId}`);
        }

        setTimeout(async () => await pubsubService.publishOnStudentsAnswersChanged(pubsub, lessonId, teacherId,
            await this.getStudentsAnswers(lessonId)), 0);
        return await pubsubService.subscribeOnStudentsAnswersChanged(pubsub, lessonId, teacherId);
    }

    async subscribeOnCorrectAnswersShown(pubsub, lessonId, studentId) {
        if (!await studentLessonService.studentLessonExists(lessonId, studentId) || !await this.existsActiveByLessonId(lessonId)) {
            throw new NotFoundError(`No lesson ${lessonId} of such student ${studentId}`);
        }

        setTimeout(async () => await pubsubService.publishOnTeacherShowedRightAnswers(pubsub, lessonId, studentId,
            await lessonAnswersService.getShownAnswers(lessonId)), 0);
        return await pubsubService.subscribeOnTeacherShowedRightAnswers(pubsub, lessonId, studentId)
    }

    async subscribeOnLessonStarted(pubsub, lessonId) {
        if (await this.existsActiveByLessonId(lessonId)) {
            throw new ValidationError(`Lesson ${lessonId} already started`)
        }

        return await pubsubService.subscribeOnLessonStarted(pubsub, lessonId);
    }

    /**
     * Returns all tasks by lessonId, students answers are got in resolve for every task type
     */
    async studentGetAnswers(lessonId) {
        if (!await this.existsActiveByLessonId(lessonId)) {
            throw new ValidationError(`Lesson ${lessonId} already started`)
        }

        return await Task.findAll({
            include: allTasksByLessonIdInclude(lessonId),
        });
    }

    async studentLeaveLesson(pubsub, lessonId, studentId) {
        if (!await this.lessonExists(lessonId)) {
            throw new NotFoundError(`No lesson ${lessonId} found`);
        }

        if (!await studentLessonService.studentLessonExists(lessonId, studentId)) {
            throw new ValidationError(`Student ${studentId} is not on lesson ${lessonId}`);
        }

        await studentLessonService.leaveLesson(studentId, lessonId);

        const teacher = await teacherLessonService.getLessonTeacher(lessonId)
        const students = await studentLessonService.getLessonStudents(lessonId)
        for (let student of students) {
            await pubsubService.publishOnPresentStudentsChanged(pubsub, lessonId, student.userId, students)
        }
        await pubsubService.publishOnPresentStudentsChanged(pubsub, lessonId, teacher.userId, students)

        return true;
    }

    async getLessonsByCourse(courseId) {
        const lessons = await LessonMarkup.findAll({
            include: {
                association: 'courses',
                where: {
                    courseId,
                },
                required: true,
                attributes: []
            }
        });

        return await this.convertLessonMarkupsToProteges(lessons);
    }

    async convertLessonMarkupsToProteges(lessons) {
        return await Promise.all(
            lessons.map(lesson => markupService.getMarkupProtege(lesson.lessonMarkupId))
        );
    }

    async getFullLesson(lessonId) {
        return await Lesson.findOne({
            include: fullLessonInclude,
            lessonId,
        });
    }

    async getTeacherLesson(teacherId, lessonId) {
        if (!await lessonTeacherService.lessonBelongsToTeacher(lessonId, teacherId)) {
            throw new NotFoundError(`No lesson ${lessonId} found of teacher ${teacherId}`)
        }

        return await Lesson.findOne({
            where: {lessonId},
        });
    }

    async getLessonsRunByTeacher(teacherId) {
        const lessons = await Lesson.findAll({
            include: allLessonsRunByTeacherInclude(teacherId),
        });

        return {
            lessons,
            total: lessons.length,
        }
    }

    async subscribeOnStudentOnLesson(pubsub, lessonId, studentId) {
        return await pubsubService.subscribeOnStudentOnLesson(pubsub, lessonId, studentId);
    }

    async getMultipleChoicePlainInputTotalCount(lessonId) {
        const types = [TaskTypeEnum.MULTIPLE_CHOICE, TaskTypeEnum.PLAIN_INPUT];

        return await Gap.count({
            include: allGapsByLessonIdInclude(lessonId, types),
        });
    }

    async getMatchingQATotalCount(lessonId) {
        const types = [TaskTypeEnum.MATCHING, TaskTypeEnum.QA];

        return await Sentence.count({
            include: allSentencesByLessonIdInclude(lessonId, types),
        });
    }

    // all tasks "subtasks" (answers in QA, or left column sentences in MATCHING)
    async getTotalCount(lessonId) {
        const multipleChoiceAndPlainInputTotalCount = await this.getMultipleChoicePlainInputTotalCount(lessonId);
        const matchingQATotalCount = await this.getMatchingQATotalCount(lessonId);

        return multipleChoiceAndPlainInputTotalCount + matchingQATotalCount;
    }

    async getMultipleChoicePlainInputAnsweredCount(lessonId, studentId) {
        const types = [TaskTypeEnum.MULTIPLE_CHOICE, TaskTypeEnum.PLAIN_INPUT];

        return await Gap.count({
            include: allAnsweredGapsByLessonIdAndStudentIdInclude(lessonId, studentId, types),
        });
    }

    async getMatchingQAAnsweredCount(lessonId, studentId) {
        const types = [TaskTypeEnum.MATCHING, TaskTypeEnum.QA];

        return await Sentence.count({
            include: allAnsweredSentencesByLessonIdAndStudentIdInclude(lessonId, studentId, types),
        });
    }

    // all tasks, which student answered to
    async getAnsweredCount(lessonId, studentId) {
        const multipleChoiceAndPlainInputAnsweredCount = await this.getMultipleChoicePlainInputAnsweredCount(lessonId, studentId);
        const matchingQAAnsweredCount = await this.getMatchingQAAnsweredCount(lessonId, studentId);

        return multipleChoiceAndPlainInputAnsweredCount + matchingQAAnsweredCount;
    }

    async getMultipleChoicePlainInputCorrectAnsweredCount(lessonId, studentId) {
        const types = [TaskTypeEnum.MULTIPLE_CHOICE, TaskTypeEnum.PLAIN_INPUT];

        return await Gap.count({
            include: allCorrectAnsweredGapsByLessonIdAndStudentIdInclude(lessonId, studentId, types),
        });
    }

    async getMatchingQACorrectAnsweredCount(lessonId, studentId) {
        const types = [TaskTypeEnum.MATCHING, TaskTypeEnum.QA];

        return await Sentence.count({
            include: allCorrectAnsweredSentencesByLessonIdAndStudentIdInclude(lessonId, studentId, types),
        });
    }

    // all tasks, which student answered correctly to
    async getCorrectAnsweredCount(lessonId, studentId) {
        const multipleChoiceAndPlainInputCorrectAnsweredCount = await this.getMultipleChoicePlainInputCorrectAnsweredCount(lessonId, studentId);
        const matchingQACorrectAnsweredCount = await this.getMatchingQACorrectAnsweredCount(lessonId, studentId);

        return multipleChoiceAndPlainInputCorrectAnsweredCount + matchingQACorrectAnsweredCount;
    }

    async getStudentCompleteness(lessonId, studentId) {
        const totalCount = await this.getTotalCount(lessonId);
        const answeredCount = await this.getAnsweredCount(lessonId, studentId);

        return answeredCount / totalCount * 100;
    }

    async getStudentScore(lessonId, studentId) {
        const answeredCount = await this.getAnsweredCount(lessonId, studentId);
        const correctCount = await this.getCorrectAnsweredCount(lessonId, studentId);

        return correctCount / answeredCount * 100;
    }

    async getTotalScore(lessonId, studentId) {
        const totalCount = await this.getTotalCount(lessonId);
        const correctCount = await this.getCorrectAnsweredCount(lessonId, studentId);

        return correctCount / totalCount * 100;
    }
}

module.exports = new LessonService();
