const {
    Lesson,
    LessonTeacher,
    TaskList,
    LessonStudent,
    lessonInclude,
    lessonTasksInclude,
    Task,
    allTasksByLessonIdInclude,
    allLessonsBySchoolIdInclude,
    allSchoolLessonsByTeacherIdInclude,
    allTasksByLessonIdInclude,
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
const optionService = require("./optionService");
const homeworkService = require("./homeworkService");
const lessonTeacherService = require('./lessonTeacherService');
const studentLessonService = require("./studentLessonService");
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

        // todo: refactor
        if (lesson.lessonTaskList) {
            for (let taskListTask of lesson?.lessonTaskList?.taskListTaskListTasks || []) {
                for (let taskSentence of taskListTask?.taskListTaskTask?.taskTaskSentences || []) {
                    for (let sentenceGap of taskSentence?.taskSentenceSentence?.sentenceSentenceGaps || []) {
                        for (let gapOption of sentenceGap?.sentenceGapGap?.gapGapOptions || []) {
                            await gapOption.gapOptionOption.destroy();
                        }
                        await sentenceGap.sentenceGapGap.destroy();
                    }
                    await taskSentence.taskSentenceSentence.destroy();
                }
                await taskListTask.taskListTaskTask.destroy();
            }
        }

        // todo: delete attachments

        await lesson.destroy();

        return true;
    }

    async deleteByTeacherId(teacherId) {
        const lessons = await Lesson.findAll({
            include: [
                {
                    association: 'lessonLessonTeacher',
                    where: {teacherId},
                    required: true
                },
                lessonInclude
            ]
        })

        for (let lesson of lessons) {
            await this.deleteById(lesson.lessonId);
        }

        return !!lessons.length;
    }

    async deleteBySchoolId(schoolId) {
        const lessons = await Lesson.findAll({
            include: [
                allLessonsBySchoolIdInclude(schoolId),
                lessonInclude,
            ]
        })

        for (let lesson of lessons) {
            await this.deleteById(lesson.lessonId);
        }

        return !!lessons.length;
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
        if (await teacherService.existsAnonymousById(teacherId))
            await this.deleteBySchoolId(school.schoolId);

        const newLesson = await Lesson.create({name, description, schoolId: school.schoolId});
        const taskList = await TaskList.create({lessonId: newLesson.lessonId});
        await taskService.createTaskListTasks(taskList.taskListId, tasks);
        await homeworkService.addAll(teacherId, {
                lessonId: newLesson.lessonId, homeworkList
            }
        );

        return newLesson.lessonId;
    }

    async getTeacherLessons(teacherId, whereParam, page, limit) {
        const {lessonId, name} = whereParam || {};

        const and = [];

        if (lessonId) {
            and.push({lessonId});
        }
        if (name) {
            and.push(
                Sequelize.where(
                    Sequelize.fn('lower', Sequelize.col('name')),
                    {
                        [Op.like]: `%${name.toLowerCase()}%`
                    }
                )
            )
        }
        const where = {[Op.and]: and};

        const options = {
            where,
            include: allSchoolLessonsByTeacherIdInclude(teacherId),
        };

        page = page && 1;
        if (limit && limit > 0) {
            options.offset = (page - 1) * limit;
        }

        const countedLessons = await Lesson.findAndCountAll(options);

        return (({count, rows}) => ({
            total: count,
            lessons: rows
        }))(countedLessons);
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

    async startLesson(pubsub, lessonId, teacherId) {
        if (!await lessonTeacherService.teacherLessonExists(lessonId, teacherId))
            throw new NotFoundError(`No lesson ${lessonId} of such teacher ${teacherId}`);

        if (await this.existsActiveByLessonId(lessonId)) {
            throw new ValidationError(`Lesson is already active lessonId: ${lessonId}`);
        }

        const upd = await Lesson.update({
            status: LessonStatusEnum.ACTIVE
        }, {
            where: {
                lessonId
            }
        });

        if (upd[0]) {
            await pubsubService.publishLessonStarted(pubsub, lessonId, {
                lessonId: lessonId, status: 'ACTIVE'
            });
        }

        return !!upd[0];
    }

    async finishLesson(pubsub, lessonId, teacherId) {
        if (!await lessonTeacherService.teacherLessonExists(lessonId, teacherId)) {
            throw new NotFoundError(`No lesson ${lessonId} of such teacher ${teacherId}`);
        }

        if (await this.existsPendingByLessonId(lessonId)) {
            throw new ValidationError(`Lesson is already pending lessonId: ${lessonId}`);
        }

        const upd = await Lesson.update({
            status: LessonStatusEnum.PENDING
        }, {
            where: {
                lessonId
            }
        });

        // clean up
        await studentLessonService.removeAllStudents(lessonId);
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
        await pubsubService.publishOnPresentStudentsChanged(pubsub, lessonId, teacher.userId, students)
        return true;
    }

    async deleteLesson(lessonId, teacherId) {
        if (!await lessonTeacherService.teacherLessonExists(lessonId, teacherId)) {
            throw new NotFoundError(`No lesson ${lessonId} of such teacher ${teacherId}`);
        }

        if (await this.existsActiveByLessonId(lessonId)) {
            throw new ValidationError(`Cannot delete active lesson lessonId: ${lessonId}`);
        }

        return await this.deleteById(lessonId);
    }

    async getStudentsAnswers(lessonId) {
        const lesson = await Lesson.findOne({
            where: {lessonId},
            include: lessonTasksInclude
        });

        const tasks = [];

        for (let {taskListTaskTask: task} of lesson.lessonTaskList.taskListTaskListTasks) {
            const newTask = {taskId: task.taskId, type: task.type, sentences: []};

            tasks.push(newTask);
        }

        return tasks;
    }

    async setStudentCurrentPosition(pubsub, lessonId, taskId, student) {
        if (!await studentLessonService.studentLessonExists(lessonId, student.studentId)) {
            throw new NotFoundError(`No lesson ${lessonId} of student ${student.studentId} found`);
        }
        const teacher = await teacherLessonService.getLessonTeacher(lessonId)
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
            throw new NotFoundError(`No lesson ${lessonId} of such teacher ${teacherId}`);
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
     * @param lessonId
     * @return {Promise<*[]>} all tasks by lesson id
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
        // todo: check if course belongs to teacher
        return await Lesson.findAll({
            include: {
                association: 'lessonCourses',
                where: {
                    courseId,
                },
                required: true,
                attributes: []
            }
        })
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
