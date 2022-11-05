const {NotFoundError, ValidationError, TaskTypeEnum} = require("../../utils");
const {
    Homework,
    TaskList,
    allStudentsByHomeworkIdInclude,
    Student,
    Sentence,
    allGapsByHWIdInclude,
    allSentencesByHWIdInclude,
    allAnsweredSentencesByHWIdAndStudentIdInclude,
    allAnsweredGapsByHWIdAndStudentIdInclude,
    allCorrectAnsweredSentencesByHWIdAndStudentIdInclude,
    allCorrectAnsweredGapsByHWIdAndStudentIdInclude,
    Task,
    Gap,
    fullHomeworkInclude,
    TaskListTask,
} = require("../../db/entities");
const taskService = require("./taskService");
const lessonTeacherService = require("./lessonTeacherService");
const studentLessonService = require("./studentLessonService");
const Sequelize = require("sequelize");

class HomeworkService {

    /**
     * Add homework with such tasks t0 lesson (markup)
     */
    async addToLessonMarkup(lessonMarkupId, { tasks }) {
        const newHomework = await Homework.create({ lessonMarkupId });
        const taskList = await TaskList.create({homeworkId: newHomework.homeworkId});
        await taskService.createTaskListTasks(taskList.taskListId, tasks);
        return newHomework.homeworkId;
    }

    async addToLessonMarkupRaw(lessonMarkupId, { tasks }) {
        const newHomework = await Homework.create({ lessonMarkupId });
        const taskList = await TaskList.create({homeworkId: newHomework.homeworkId});
        await taskService.createTaskListRawTasks(taskList.taskListId, tasks);
        return newHomework.homeworkId;
    }

    /**
     * Add homework with such tasks t0 lesson (session)
     */
    async addToLesson(lessonId, {homeworkMarkupId, tasks}) {
        const newHomework = await Homework.create({homeworkMarkupId, lessonId});
        const taskList = await TaskList.create({homeworkId: newHomework.homeworkId});
        await taskService.createTaskListTasks(taskList.taskListId, tasks);
        return newHomework.homeworkId;
    }

    async addToLessonRaw(lessonId, {homeworkMarkupId, tasks}) {
        const newHomework = await Homework.create({homeworkMarkupId, lessonId});
        const taskList = await TaskList.create({homeworkId: newHomework.homeworkId});

        // removing taskId field from task, if tasks were fetched from db and processed with .get({ plain:true })
        tasks.forEach(task => delete task.taskId);

        // sequelize accepts tasks with sentences, gaps etc
        await taskService.createTaskListRawTasks(taskList.taskListId, tasks);

        return newHomework.homeworkId;
    }

    // make sure to set homeworkMarkupId after creating hw, as it's used as reference to create protege hw
    async addHomeworkListToLessonMarkup(lessonMarkupId, homeworkList) {
        return Promise.all(homeworkList.map(
            (homework) =>
                this.addToLessonMarkup(lessonMarkupId, homework)
                    .then(homeworkId => homework.homeworkMarkupId = homeworkId)
        ));
    }

    async addHomeworkListToLessonMarkupRaw(lessonMarkupId, homeworkList) {
        return Promise.all(homeworkList.map(
            (homework) => this.addToLessonMarkupRaw(lessonMarkupId, homework)
        ));
    }

    async addHomeworkListToLesson(lessonId, homeworkList) {
        return Promise.all(homeworkList.map(
            (homework) => this.addToLesson(lessonId, homework)
        ));
    }

    // tasks contain sentences->gaps->options, which can be accepted by sequelize without the need to parse it
    // check HomeworkService#addToLessonRawTasks
    async addHomeworkListToLessonRaw(lessonId, homeworkList) {
        return Promise.all(homeworkList.map(
            (homework) => this.addToLessonRaw(lessonId, homework)
        ));
    }

    /**
     * Returns all homework of specified lesson or with such homeworkId
     */
    async getAllByLessonIdOrHomeworkIdForTeacher(teacherId, homeworkId, lessonId) {
        const where = {};
        if (!homeworkId && !lessonId) {
            throw new ValidationError(`No homeworkId and lessonId specified`);
        }
        // teacher must also own the lesson homework belongs to
        if (homeworkId) {
            // todo: implement teacherHomeworkExists
            // if (!await this.teacherHomeworkExists()) {
            //     throw new NotFoundError(`No homework ${homeworkId} found of teacher ${teacherId}`)
            // }
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
        });
    }

    async getAllByLessonIdOrHomeworkIdForStudent(studentId, homeworkId, lessonId) {
        const where = {};
        if (!homeworkId && !lessonId) {
            throw new ValidationError(`No homeworkId and lessonId specified`);
        }
        // student can get homework only by homework id
        if (homeworkId) {
            where.homeworkId = homeworkId;
        }
        if (lessonId) {
            // todo: add access check when homework belongs to school,
            //       so that only school students have access
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

    async getAllByLessonMarkupId(lessonMarkupId) {
        return await Homework.findAll({
            where: { lessonMarkupId },
        });
    }

    // return homeworkId as well in order for score to work (parent of parent query in graphql)
    async getStudents(homeworkId) {
        // all students who have at least one answer on any task of this homework
        return await Student.findAll({
            include: [
                allStudentsByHomeworkIdInclude(homeworkId),
                'user',
            ],
            attributes: {
                include: [
                    [Sequelize.col('user.name'), 'name'],
                ],
            },
            raw: true,
        }).then(students => students.map(
            student => ({...student, homeworkId})
        ));
    }

    async getMultipleChoicePlainInputTotalCount(homeworkId) {
        const types = [TaskTypeEnum.MULTIPLE_CHOICE, TaskTypeEnum.PLAIN_INPUT];

        return await Gap.count({
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
        const types = [TaskTypeEnum.MULTIPLE_CHOICE, TaskTypeEnum.PLAIN_INPUT];

        return await Gap.count({
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
        const types = [TaskTypeEnum.MULTIPLE_CHOICE, TaskTypeEnum.PLAIN_INPUT];

        return await Gap.count({
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

    async getStudentProgress(homeworkId, studentId) {
        const totalCount = await this.getTotalCount(homeworkId);
        const answeredCount = await this.getAnsweredCount(homeworkId, studentId);

        if (!totalCount) {
            return 100;
        }

        return answeredCount / totalCount * 100;
    }

    async getStudentScore(homeworkId, studentId) {
        const answeredCount = await this.getAnsweredCount(homeworkId, studentId);
        const correctCount = await this.getCorrectAnsweredCount(homeworkId, studentId);

        if (!correctCount) {
            return null;
        }

        return correctCount / answeredCount * 100;
    }

    async getTotalScore(homeworkId, studentId) {
        const totalCount = await this.getTotalCount(homeworkId);
        const correctCount = await this.getCorrectAnsweredCount(homeworkId, studentId);

        if (!totalCount) {
            return 100;
        }

        return correctCount / totalCount * 100;
    }

    async homeworkExists(homeworkId) {
        return !!await Homework.count({
            where: { homeworkId },
        });
    }

    async removeFromLesson(teacherId, lessonId, homeworkId) {
        if (!await this.homeworkExists(homeworkId)) {
            throw new NotFoundError(`No homework ${homeworkId} found`);
        }

        await Homework.update({
            lessonId: null,
        }, {
            where: { homeworkId },
        });
        return true;
    }

    async removeFromLessonMarkup(teacherId, lessonMarkupId, homeworkId) {
        if (!await this.homeworkExists(homeworkId)) {
            throw new NotFoundError(`No homework ${homeworkId} found`);
        }

        await Homework.update({
            lessonMarkupId: null,
        }, {
            where: { homeworkId },
        });
        return true;
    }

    async delete(teacherId, homeworkId) {
        if (!await this.homeworkExists(homeworkId)) {
            throw new NotFoundError(`No homework ${homeworkId} found`);
        }

        throw new NotFoundError(`Not implemented due to different flow`);
    }

    async showAnswers(teacherId, homeworkId) {
        const res = await this.getAllByLessonIdOrHomeworkIdForTeacher(teacherId, {
            homeworkId: homeworkId,
            lessonId: null
        })
        if (!res[0]) {
            throw new NotFoundError(`No homework ${homeworkId}  of teacher ${teacherId} found`);
        }
       const tasks = await Task.findAll({
               include: {
                   association: "taskList",
                   required: true,
                   include: {
                       association: "homework",
                       where: {homeworkId},
                       required: true,
                   }
               }
           }
       )
        const taskIds = tasks.map(task => task.taskId)
        const upd = await Task.update({
            answersShown: true
        }, {
            where:{
                taskId: taskIds
            }
        })
        return !!upd[0]
    }

    async getFullHomeworkByLessonId(lessonId) {
        return await Homework.findAll({
            include: fullHomeworkInclude,
            where: {lessonId},
        }).then(homeworks => homeworks.map(homework => homework.get({ plain: true })));
    }
}

module.exports = new HomeworkService();
