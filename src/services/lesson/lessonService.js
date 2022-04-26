const { Lesson, LessonTeacher, TaskList, TaskListTask, LessonStudent, StudentOption, lessonInclude, Student, lessonGapsInclude} = require('../../models');
const { LessonStatusEnum: LessonStatusEnum, NotFoundError, ValidationError} = require('../../utils');
const teacherService = require('../user/teacherService');
const taskService = require('./taskService');
const gapService = require("./gapService");
const optionService = require("./optionService");
const pubsubService = require("../pubsubService");
const Sequelize = require('sequelize');
const studentService = require("../user/studentService");
const { Op } = Sequelize;


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


    // async deleteByIdOld(lessonId) {
    //     const [ deletedLessons ] = await sequelize.query(DELETE_LESSON_BY_ID, {
    //         replacements: { lessonId }
    //     });
    //
    //     for (let { lessonId } of deletedLessons) {
    //         await taskService.deleteByLessonId(lessonId);
    //     }
    //
    //     return !!deletedLessons.length;
    // }

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
            for (let sentence of task.sentences) {
                for (let gap of sentence.gaps) {
                    if (!gap.options.some(x => x.isCorrect))
                        throw new ValidationError(`No right option provided`);
                }
            }
        }

        // check anonymous
        if (await teacherService.existsAnonymousById(teacherId))
            await this.deleteByTeacherId(teacherId);

        const newLesson = await Lesson.create({name});

        for (let {answerShown, sentences} of tasks) {
            const newTask = await taskService.create(answerShown, sentences);

            const taskList = await TaskList.create({lessonId: newLesson.lessonId});
            await TaskListTask.create({taskListId: taskList.taskListId, taskId: newTask.taskId});
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
        const lesson = await Lesson.findOne({
            where: {
                lessonId,
            }
        })

        return lesson;
    }

    async startLesson(pubsub, lessonId, teacherId) {
        if (!await this.teacherLessonExists(lessonId, teacherId))
            throw new NotFoundError(`No lesson ${lessonId} of such teacher ${teacherId}`);

        if (await this.existsActiveByLessonId(lessonId)) {
            throw new ValidationError(`Lesson is already active lessonId: ${lessonId}`);
        }

        // todo: make one db request with custom error messages
        const upd = await Lesson.update({
            status: LessonStatusEnum.ACTIVE
        }, {
            where: {
                lessonId
            }
        });

        if(upd[0]){
            await pubsubService.publishOnLessonStatusChanged(pubsub, lessonId, {
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
        // todo: make one db request with custom error messages

        const upd = await Lesson.update({
            status: LessonStatusEnum.PENDING
        }, {
            where: {
                lessonId
            }
        });

        if(upd[0]){
            await pubsubService.publishOnLessonStatusChanged(pubsub, lessonId, {
                lessonId: lessonId, status:'PENDING'
            });
        }

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

    async setAnswer(pubsub, lessonId, studentId, optionId){
        if(!await this.studentLessonExists(lessonId, studentId)){
            throw new NotFoundError(`No lesson ${lessonId} of student ${studentId} found`);
        }

        // todo: add check if option belongs to lesson
        if (await optionService.existsStudentAnswer(studentId, optionId)) {
            throw new ValidationError(`Student ${studentId} has already chosen option ${optionId}`)
        }

        const studentOption = await StudentOption.create({
            optionId,
            studentId
        });

        const teacher = await teacherService.findOneByLessonId(lessonId);
        await pubsubService.publishOnStudentsAnswersChanged(pubsub, lessonId, teacher.teacherId,
            await this.getStudentsAnswers(lessonId));

        return (!!studentOption);
    }

    async deleteLesson(lessonId, teacherId) {
        if(!await this.teacherLessonExists(lessonId, teacherId)){
           throw new NotFoundError(`No lesson ${lessonId} of such teacher ${teacherId}`);
        }

        if (await this.existsActiveByLessonId(lessonId)) {
           throw new ValidationError(`Cannot delete active lesson lessonId: ${lessonId}`);
        }
        // todo: make one db request with custom error messages

        return await this.deleteById(lessonId);
    }

    async getStudentsAnswers(lessonId) {
        const lesson = await Lesson.findOne({
            where: { lessonId },
            include: lessonGapsInclude
        });

        const tasks = [];

        for (let { taskListTaskTask : task } of lesson.lessonTaskList.taskListTaskListTasks) {
            const newTask = { taskId: task.taskId, sentences: [] };
            for (let { taskSentenceSentence : sentence } of task.taskTaskSentences) {
                const newSentence = { sentenceId: sentence.sentenceId, gaps: [] };
                for (let { sentenceGapGap : gap } of sentence.sentenceSentenceGaps) {
                    const newGap = { gapId: gap.gapId };
                    newGap.studentsAnswers = await gapService.getStudentsAnswers(gap.gapId);
                    newSentence.gaps.push(newGap);
                }
                newTask.sentences.push(newSentence);
            }
            tasks.push(newTask);
        }

        return tasks;
    }

    async subscribeOnStudentAnswersChanged(pubsub, lessonId, teacherId) {
        if (!await this.teacherLessonExists(lessonId, teacherId)) {
            throw new NotFoundError(`No lesson ${lessonId} of such teacher ${teacherId}`);
        }

        setTimeout(async () => await pubsubService.publishOnStudentsAnswersChanged(pubsub, lessonId, teacherId,
            await this.getStudentsAnswers(lessonId)), 0);
        return await pubsubService.subscribeOnStudentsAnswersChanged(pubsub, lessonId, teacherId);
    }

}

module.exports = new LessonService();
