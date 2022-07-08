const { Lesson, LessonTeacher, TaskList, TaskListTask, LessonStudent, StudentOption, lessonInclude, lessonGapsInclude, Option, GapOption,
    lessonTasksInclude,
    Task,
    allTasksByLessonIdInclude
} = require('../../db/models');
const { LessonStatusEnum: LessonStatusEnum, NotFoundError, ValidationError, TaskTypeEnum} = require('../../utils');
const teacherService = require('../user/teacherService');
const taskService = require('./taskService');
const pubsubService = require("../pubsubService");
const Sequelize = require('sequelize');
const studentService = require("../user/studentService");
const lessonAnswersService = require("./lessonAnswersService");
const { Op } = Sequelize;
const store = require("store2");

class LessonService {
    async teacherLessonExists(lessonId, teacherId){
        return !!await LessonTeacher.count({
            where: {
                lessonId,
                teacherId
            }
        });
    }

    async studentLessonExists(lessonId, studentId){
        return !!await LessonStudent.count({
            where: {
                lessonId,
                studentId
            }
        });
    }

    async lessonExists(lessonId){
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
            where: { lessonId },
            include: lessonInclude
        });

        if (!lesson)
            return false;

        if (lesson.lessonTaskList) {
            for (let taskListTask of lesson.lessonTaskList.taskListTaskListTasks) {
                for (let taskSentence of taskListTask.taskListTaskTask.taskTaskSentences) {
                    for (let sentenceGap of taskSentence.taskSentenceSentence.sentenceSentenceGaps) {
                        for (let gapOption of sentenceGap.sentenceGapGap.gapGapOptions) {
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
                    where: { teacherId },
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

    async create({ name, tasks }, teacherId) {
        // check if right option exists for every gap
        for (let task of tasks) {
            await taskService.checkForCorrectOptionPresence(task);
        }

        // check if anonymous, then delete all existing lessons
        if (await teacherService.existsAnonymousById(teacherId))
            await this.deleteByTeacherId(teacherId);

        const newLesson = await Lesson.create({name});
        const taskList = await TaskList.create({lessonId: newLesson.lessonId});

        // create and connect to lesson
        for (const task of tasks) {
            const taskId = await taskService.create(task);

            await TaskListTask.create({taskListId: taskList.taskListId, taskId});
        }

        await LessonTeacher.create({teacherId, lessonId: newLesson.lessonId})
        return newLesson.lessonId;
    }

    async getTeacherLessons(teacherId, whereParam, page, limit) {
        const { lessonId, name } = whereParam || {};

        const and = [];

        if (lessonId) {
            and.push({ lessonId });
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
        const where = { [Op.and]: and };

        const options = {
            where,
            include: {
                association: 'lessonLessonTeacher',
                where: { teacherId },
                required: true
            }
        };

        page = page && 1;
        if (limit && limit > 0) {
            options.offset = (page - 1) * limit;
        }

        const countedLessons = await Lesson.findAndCountAll(options);

        return (({ count, rows }) => ({
            total: count,
            lessons: rows
        }))(countedLessons);
    }

    async getStudentLesson(lessonId, studentId){
        if(!await this.studentLessonExists(lessonId, studentId)){
            throw new NotFoundError(`No lesson ${lessonId} of such student ${studentId} found`);
        }
        return await Lesson.findOne({
            where: {
                lessonId,
            }
        });
    }

    async startLesson(pubsub, lessonId, teacherId) {
        if (!await this.teacherLessonExists(lessonId, teacherId))
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

        if(upd[0]){
            await pubsubService.publishLessonStarted(pubsub, lessonId, {
                lessonId: lessonId, status:'ACTIVE'
            });
        }

        return !!upd[0];
    }

    async finishLesson(pubsub, lessonId, teacherId) {
        if (!await this.teacherLessonExists(lessonId, teacherId)) {
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

        store.clear();

        return !!upd[0];
    }

    async joinLesson(pubsub, lessonId, studentId) {
       if(!await this.lessonExists(lessonId)){
           throw new NotFoundError(`No lesson ${lessonId} found`);
       }

       if (await this.studentLessonExists(lessonId, studentId)){
            throw new ValidationError(`Student ${studentId} is already on lesson ${lessonId}`);
       }

       const lessonStudent = await LessonStudent.create({
           lessonId,
           studentId
       });

       const teacher = await teacherService.findOneByLessonId(lessonId)
        const students = await studentService.studentsLesson(lessonId)
        for(let student of students){
            await pubsubService.publishOnPresentStudentsChanged(pubsub, lessonId, student.userId, students)
        }
        await pubsubService.publishOnPresentStudentsChanged(pubsub, lessonId, teacher.userId, students)
       return (!!lessonStudent);
    }

    async deleteLesson(lessonId, teacherId) {
        if(!await this.teacherLessonExists(lessonId, teacherId)){
           throw new NotFoundError(`No lesson ${lessonId} of such teacher ${teacherId}`);
        }

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
        if (!await this.studentLessonExists(lessonId, student.studentId)) {
            throw new NotFoundError(`No lesson ${lessonId} of student ${student.studentId} found`);
        }
        const teacher = await teacherService.findOneByLessonId(lessonId)
        const studentsCurrentTask = store.get(lessonId);
        if(!studentsCurrentTask){
            store(lessonId, [{taskId, student}])
        }else {
            if (studentsCurrentTask.find(el => el.student.studentId === student.studentId)){
                const newStudentsCurrentTask = studentsCurrentTask.map((el)=>({
                        ...el,
                        taskId:(el.student.studentId===student.studentId)?taskId:el.taskId
                    }))
                store( lessonId, newStudentsCurrentTask)

            }else {
                store.add(lessonId, [{taskId, student}])
            }
        }
        const students = await studentService.studentsLesson(lessonId)
        for(let student of students){
            await pubsubService.publishOnStudentPosition(pubsub, lessonId, student.userId, store.get(lessonId))
        }
        await pubsubService.publishOnStudentPosition(pubsub, lessonId, teacher.userId, store.get(lessonId))
        return true;
    }

    async getStudentCurrentPosition (pubsub, lessonId, userId){
        setTimeout(async () => await pubsubService.publishOnStudentPosition(pubsub, lessonId, userId,
                 store.get(lessonId) || [] ), 0)
        return await pubsubService.subscribeOnStudentPosition(pubsub, userId, lessonId)
    }


    async subscribeOnStudentAnswersChanged(pubsub, lessonId, teacherId) {
        if (!await this.teacherLessonExists(lessonId, teacherId)) {
            throw new NotFoundError(`No lesson ${lessonId} of such teacher ${teacherId}`);
        }

        setTimeout(async () => await pubsubService.publishOnStudentsAnswersChanged(pubsub, lessonId, teacherId,
            await this.getStudentsAnswers(lessonId)), 0);
        return await pubsubService.subscribeOnStudentsAnswersChanged(pubsub, lessonId, teacherId);
    }

    async subscribeOnCorrectAnswersShown(pubsub, lessonId, studentId) {
        if (!await this.studentLessonExists(lessonId, studentId) || !await this.existsActiveByLessonId(lessonId)) {
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
    async studentGetAnswers(lessonId){
        if (!await this.existsActiveByLessonId(lessonId)) {
            throw new ValidationError(`Lesson ${lessonId} already started`)
        }

        return await Task.findAll({
            include: allTasksByLessonIdInclude(lessonId),
        });
    }

    async studentLeaveLesson(pubsub, lessonId, studentId) {
        if(!await this.lessonExists(lessonId)){
            throw new NotFoundError(`No lesson ${lessonId} found`);
        }

        if (!await this.studentLessonExists(lessonId, studentId)){
            throw new ValidationError(`Student ${studentId} is not on lesson ${lessonId}`);
        }

        const lessonStudent = await LessonStudent.destroy({
            where: {
                lessonId,
                studentId
            }
        })

        const teacher = await teacherService.findOneByLessonId(lessonId)
        const students = await studentService.studentsLesson(lessonId)
        for(let student of students){
            await pubsubService.publishOnPresentStudentsChanged(pubsub, lessonId, student.userId, students)
        }
        await pubsubService.publishOnPresentStudentsChanged(pubsub, lessonId, teacher.userId, students)

        return !!lessonStudent;
    }

}

module.exports = new LessonService();
