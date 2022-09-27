const {
    Lesson,
    LessonStudent,
    lessonInclude,
    lessonTasksInclude,
    Task,
    allTasksByLessonIdInclude,
    fullLessonInclude,
    LessonMarkup,
    LessonTeacher,
    allLessonsRunByTeacherInclude,
    lessonByHomeworkIdInclude,
    fullLessonMarkupInclude,
    allLessonsBySchoolIdInclude,
    allSchoolLessonsByTeacherIdInclude,
    Gap,
    Sentence,
    Student,
    allStudentsByLessonIdInclude, allLessonsByLessonMarkupInclude, allSchoolMarkupsByTeacherIdInclude,
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
const optionService = require("./optionService");
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

    // used both for deleting markup and protege
    async delete(lesson) {
        // lesson is either markup or session
        const tasks = lesson?.taskList?.tasks || [];
        for (let task of tasks) {
            for (let sentence of task.sentences || []) {
                for (let gap of sentence.gaps || []) {
                    for (let option of gap.options || []) {
                        await option.destroy();
                    }
                    await gap.destroy();
                }
                await sentence.destroy();
            }
            await task.destroy();
        }

        // todo: delete attachments

        await lesson.destroy();

        return true;
    }

    async deleteMarkupById(lessonMarkupId) {
        const lesson = await LessonMarkup.findOne({
            where: { lessonMarkupId },
            include: fullLessonMarkupInclude,
        });

        if (!lesson)
            return false;

        return await this.delete(lesson);
    }

    async deleteProtegeById(lessonId) {
        // todo: find markup and delete it
        //       keep in mind refactoring LessonService#editLesson, where only protege is deleted
        //       using this method
        //       and LessonService#deleteByTeacherId
        const lesson = await Lesson.findOne({
            where: { lessonId },
            include: lessonInclude,
        });

        if (!lesson)
            return false;

        return await this.delete(lesson);
    }

    async deleteByTeacherId(teacherId) {
        const markups = await LessonMarkup.findAll({
            where: {teacherId},
        });

        for (let {lessonMarkupId} of markups) {
            const {lessonId} = await markupService.getMarkupProtege(lessonMarkupId);
            await this.deleteProtegeById(lessonId);
            await this.deleteMarkupById(lessonMarkupId);
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
            const protege = await markupService.getMarkupProtege(lesson.lessonMarkupId);
            await this.deleteProtegeById(protege.lessonId);

            await this.deleteMarkupById(lesson.lessonMarkupId);
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
        if (await teacherService.existsAnonymousById(teacherId)) {
            await this.deleteBySchoolId(school.schoolId);
        }

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
            include: allSchoolMarkupsByTeacherIdInclude(teacherId),
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

    async recreateLessonProtegeByProtegeId(lessonId) {
        const {lessonMarkupId, name, description, tasks} = await markupService.getMarkupWithTasksAndHomeworkByLessonId(lessonId);

        const homeworks = await homeworkService.getFullHomeworkByLessonId(lessonId);
        homeworks.forEach(homework => homework.tasks = homework.taskList.tasks);

        await this.deleteProtegeById(lessonId);
        await markupService.createProtegeRawTasksWithId(lessonId, name, description, tasks, homeworks, lessonMarkupId);
    }

    /*
        Markup-Lesson logic:
            For teacherLessons query we return already created proteges for markups.
            For startLesson mutation we accept id of protege from Lesson table,
            after starting this protege it's no longer protege so
            we create new one for the correspondent markup
     */
    async startLesson(pubsub, lessonId, teacherId) {
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

        // creating new protege check markupService#getMarkupProtege for more details
        // await this.recreateLessonProtegeByProtegeId(lessonId);
        await markupService.createMarkupProtegeByLessonId(lessonId);

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
        await optionService.removeAllStudentsAnswersByLessonId(lessonId);
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
        if (teacher)
            await pubsubService.publishOnPresentStudentsChanged(pubsub, lessonId, teacher.userId, students)
        return true;
    }

    async deleteLesson(lessonId, teacherId) {
        await markupService.checkIfLessonIsProtegeAndBelongsToTeacher(lessonId, teacherId);

        if (await this.existsActiveByLessonId(lessonId)) {
            throw new ValidationError(`Cannot delete active lesson lessonId: ${lessonId}`);
        }

        return await this.deleteProtegeById(lessonId);
    }

    async getStudentsAnswers(lessonId) {
        const lesson = await Lesson.findOne({
            where: { lessonId },
            include: lessonTasksInclude
        });

        const tasks = [];

        for (let { taskListTaskTask : task } of lesson.taskList.taskListTaskListTasks) {
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

        const teacher = await teacherLessonService.getLessonTeacher(lessonId)

        if (teacher)
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

        if (teacher)
            await pubsubService.publishOnPresentStudentsChanged(pubsub, lessonId, teacher.userId, students)

        return true;
    }

    async getMarkupsByCourse(courseId) {
        return await LessonMarkup.findAll({
            include: {
                association: 'courses',
                where: {
                    courseId,
                },
                required: true,
                attributes: []
            }
        });
    }

    async getLessonsByCourse(courseId) {
        const markups = await this.getMarkupsByCourse(courseId);

        return await this.convertLessonMarkupsToProteges(markups);
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
        if (!await lessonTeacherService.teacherLessonExists(lessonId, teacherId)) {
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

    async editLesson(lessonId, {name: newName, description: newDescription, tasks}) {
        const markup = await markupService.getMarkupWithTasksAndHomeworkByLessonId(lessonId);

        if (!markup)
            return false;

        // todo: refactor (try cascade)
        //       otherwise use Promise.all or remove intermediate tables
        // function (async () => {})() is used for asynchronous deleting
        (async () => {
            if (markup.taskList) {
                for (let {taskId, sentences} of markup.tasks || []) {
                    for (let {sentenceId, gaps} of sentences || []) {
                        for (let {gapId, options} of gaps || []) {
                            await Promise.all(
                                options.map(
                                    ({optionId}) => Option.destroy({
                                        where: { optionId },
                                    })
                            ));
                            await Gap.destroy({
                                where: { gapId },
                                cascade: true,
                            });
                        }
                        await Sentence.destroy({
                            where: { sentenceId },
                            cascade: true,
                        });
                    }
                    await TaskListTask.destroy({
                        where: {taskId},
                    });
                    await Task.destroy({
                        where: { taskId },
                        cascade: true,
                    });
                }
                await TaskList.destroy({
                    where: { taskListId: markup.taskList.taskListId },
                });
            }
        })();

        const {name, description, homework, lessonMarkupId} = markup;

        LessonMarkup.update({
            name: newName,
            description: newDescription,
        }, {
            where: { lessonMarkupId },
        });

        const newTaskList = await TaskList.create({lessonMarkupId});
        await taskService.createTaskListTasks(newTaskList.taskListId, tasks);

        const protege = await markupService.getMarkupProtege(markup.lessonMarkupId);

        await this.deleteProtegeById(protege.lessonId);

        markupService.createProtegeWithId(protege.lessonId, name, description, tasks || [], homework || [], lessonMarkupId);

        return true;
    }

    async getLessonByHomeworkId(homeworkId) {
        return await Lesson.findOne({
            include: lessonByHomeworkIdInclude(homeworkId),
        }).then(lesson => lesson?.get());
    }

    async subscribeOnStudentOnLesson(pubsub, lessonId, studentId) {
        return await pubsubService.subscribeOnStudentOnLesson(pubsub, lessonId, studentId);
    }



    async getStudents(lessonId) {
        // all students who have at least one answer on any task of this homework
        return await Student.findAll({
            include: allStudentsByLessonIdInclude(lessonId),
        }).then(students => students.map(
            // adding lesson id to returned object, cause it's needed for
            // StudentWithLessonScoreType's progress and score
            student => ({...student.get({plain: true}), lessonId}))
        );
    }

    async getLessonsByMarkup(lessonMarkupId) {
        return await Lesson.findAll({
            include: allLessonsByLessonMarkupInclude(lessonMarkupId),
        });
    }
}

module.exports = new LessonService();
