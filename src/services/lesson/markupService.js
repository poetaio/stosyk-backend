const {
    LessonMarkup,
    lessonMarkupByLessonIdInclude,
    Lesson,
    allLessonsByLessonMarkupInclude,
    TaskList,
    fullLessonMarkupInclude, Task, TaskListTask,
} = require("../../db/models");
const {LessonStatusEnum, ValidationError} = require("../../utils");
const taskService = require("./taskService");
const homeworkService = require("./homeworkService");
const lessonTeacherService = require("./lessonTeacherService");

class MarkupService {
    async getMarkupByLessonId(lessonId) {
        return await LessonMarkup.findOne({
            include: lessonMarkupByLessonIdInclude(lessonId),
        });
    }

    async getMarkupWithTasksAndHomeworkByLessonId(lessonId) {
        return await LessonMarkup.findOne({
            include: [
                lessonMarkupByLessonIdInclude(lessonId),
                ...fullLessonMarkupInclude,
            ]
        }).then(async markup => {
            markup = markup.get({ plain: true });
            markup.tasks = markup?.taskList.tasks;

            return markup;
        });
    }

    /**
     * Every lesson markup has protege. It's a lesson which is returned in teacher library
     * and corresponds to markup
     * teacher uses the protege to start new lesson, to edit corresponding lesson markup
     * Now it's the most recent created lesson, which belongs to specified markup
     * Cause when we start a lesson with the old protege we create new protege, the same goes
     */
    async getMarkupProtege(lessonMarkupId) {
        return await Lesson.findOne({
            include: allLessonsByLessonMarkupInclude(lessonMarkupId),
            where: {
                status: LessonStatusEnum.PENDING,
            },
            order: [
                ['createdAt', 'DESC']
            ],
        });
    }

    /**
     * See getLessonMarkupProtege for lesson protege insights
     * todo: seems like there is always one pending lesson for a markup
     *       which must be its protege
     */
    async isLessonProtege(lessonId) {
        const {lessonMarkupId} = await this.getMarkupByLessonId(lessonId);
        const protege = await this.getMarkupProtege(lessonMarkupId);

        if (!protege) {
             throw new ValidationError(
                 `Every lesson must have protege, but something went wrong. ` +
                 `lessonId: ${lessonId}, markupId: ${lessonMarkupId}`
             );
        }

        return lessonId === protege.lessonId;
    }

    async checkIfLessonIsProtegeAndBelongsToTeacher(lessonId, teacherId) {
        // checking if homework can be added to lesson (it's not started or finished already)
        // we forbid adding homework to active lessons, however, we must edit lesson markup to
        // its protege (pending lesson which is displayed in queries for teacher library)

        await lessonTeacherService.lessonBelongsToTeacher(lessonId, teacherId);
        await this.isLessonProtege(lessonId);
        if (
            !await lessonTeacherService.lessonBelongsToTeacher(lessonId, teacherId) ||
            !await this.isLessonProtege(lessonId)
        ) {
            const errMessage =
                `No lesson from library ${lessonId} found of teacher ${teacherId}. ` +
                `This usually means that either the lesson doesn't exits or it's already started`
            throw new ValidationError(errMessage);
        }
    }

    async createMarkup(schoolId, teacherId, name, description, tasks, homeworkList) {
        const {lessonMarkupId} = await LessonMarkup.create({
            name,
            description,
            teacherId,
            schoolId,
        });

        const taskList = await TaskList.create({lessonMarkupId: lessonMarkupId});
        await taskService.createTaskListTasks(taskList.taskListId, tasks);

        await homeworkService.addHomeworkListToLessonMarkup(lessonMarkupId, homeworkList);

        return lessonMarkupId;
    }

    async createProtege(name, description, tasks, homeworkList, lessonMarkupId) {
        const {lessonId} = await Lesson.create({
            name,
            description,
            lessonMarkupId,
        });

        const protegeTaskList = await TaskList.create({lessonId});
        await taskService.createTaskListTasks(protegeTaskList.taskListId, tasks);

        await homeworkService.addHomeworkListToLesson(lessonId, homeworkList);

        return lessonId;
    }

    async createProtegeRawTasks(name, description, tasks, homeworkList, lessonMarkupId) {
        const {lessonId} = await Lesson.create({
            name,
            description,
            lessonMarkupId,
        });

        const protegeTaskList = await TaskList.create({lessonId});
        // await taskService.createTaskListTasks(protegeTaskList.taskListId, tasks);
        tasks.forEach(task => delete task.taskId);
        await Promise.all(tasks.map(
            task => Task.create(task)
                .then(
                    taskM => TaskListTask.create({
                        taskId: taskM.taskId,
                        taskListId: protegeTaskList.taskListId,
                    })
                )
        ))

        await homeworkService.addHomeworkListToLessonRawTasks(lessonId, homeworkList);

        return lessonId;
    }

    async createMarkupAndProtege(schoolId, teacherId, name, description, tasks, homeworkList) {
        const lessonMarkupId = await this.createMarkup(schoolId, teacherId, name, description, tasks, homeworkList);

        return await this.createProtege(name, description, tasks, homeworkList, lessonMarkupId);
    }

    async deleteById(lessonMarkupId) {

    }
}

module.exports = new MarkupService();
