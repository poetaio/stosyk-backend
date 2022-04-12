const subscribePublishService = require('../subscribePublishService');
const { ActiveLesson, StudentAnswerSheet, ActiveTask, ActiveGap} = require("../../models");
const studentAnswerSheetService = require('./studentAnswerSheetService');
const StudentAnswerSheetStatusEnum = require('../../models/lesson_active/utils/StudentAnswerSheetStatusEnum')
const studentService = require('../studentService');
const ActiveLessonStatusEnum = require("../../models/lesson_active/utils/ActiveLessonStatusEnum");
const teacherLessonInclude = require('../../models/includes/teacherActiveLessonInclude');
const studentActiveLessonInclude = require('../../models/includes/studentActiveLessonInclude');
const ApiError = require("../../error/ApiError");
const lessonService = require('../lesson_constructor/lessonService');
const teacherService = require('../teacherService');
const activeTaskService = require('./activeTaskService');
const activeGapService = require('./activeGapService');
const activeOptionService = require('./activeOptionService');


class ActiveLessonService {
    async exists(activeLessonId) {
        return !!await ActiveLesson.count({ where: { id: activeLessonId } });
    }

    async existsStartedById(activeLessonId) {
        return !!await ActiveLesson.count({ where: { id: activeLessonId, status: ActiveLessonStatusEnum.STARTED } })
    }

    async existsByIdAndTeacherId(activeLessonId, teacherId) {
        return !!await ActiveLesson.count({ where: { id: activeLessonId, teacherId } })
    }

    async existsStartedByIdAndTeacherId(activeLessonId, teacherId) {
        return !!await ActiveLesson.count({ where: { id: activeLessonId, teacherId, status: ActiveLessonStatusEnum.STARTED } })
    }

    async existsByIdAndStudentId(activeLessonId, studentId) {
        // activeLesson exists
        return await ActiveLesson.count({ where: { id: activeLessonId } }) &&
            // student's answer sheet related to this lesson exists
            await studentAnswerSheetService.existsByLessonIdAndStudentId(activeLessonId, studentId);
    }

    async getOneByIdAndStudentId(studentId, activeLessonId) {
        if (!await studentAnswerSheetService.existsByLessonIdAndStudentId(activeLessonId, studentId))
            throw ApiError.badRequest(`No such activeLesson ${activeLessonId} ${studentId}`);

        return await ActiveLesson.findOne({
            where: { id: activeLessonId },
            include: studentActiveLessonInclude
        });
    }

    async getOneByIdAndTeacherId(teacherId, activeLessonId) {
        const activeLesson = await ActiveLesson.findOne({
            where: { id: activeLessonId, teacherId },
            include: teacherLessonInclude
        });

        if (!activeLesson)
            return null;
            // throw Error("No active lesson with such id");

        // if not started or finished returns only id and status
        if (activeLesson.status === ActiveLessonStatusEnum.NOT_STARTED || activeLesson.status === ActiveLessonStatusEnum.FINISHED)
            return (({id, status}) => ({id, status}))(activeLesson);
        if (activeLesson.status === ActiveLessonStatusEnum.STARTED)
            return activeLesson;
        throw ApiError.internal(`Unknown activeLesson status ${activeLesson.status}`);
    }

    // teacher creates markup, active lesson is added as well to generate link
    async create(teacherId, lessonId) {
        if (!await teacherService.exists(teacherId))
            throw ApiError.badRequest(`No teacher with id ${teacherId}`);

        const lesson = await lessonService.getOneById(lessonId);

        if (!lesson)
            throw ApiError.badRequest(`No lesson with id ${lessonId}`);

        const newActiveLesson = await ActiveLesson.create({
            teacherId,
            lessonMarkupId: lessonId
        });

        for (let { name, description, text, gaps } of lesson.tasks) {
            await activeTaskService.createWithGapsValues(newActiveLesson.id, name, description, text, gaps);
        }

        return await this.getOneByIdAndTeacherId(
            teacherId,
            newActiveLesson.id
        );
    }

    async addTaskToActiveLesson(activeLessonId, teacherId, task) {
        const { text, gaps } = task;
    }

    // adds student to lesson and returns activeLesson tasks and student's answer sheet
    async studentJoinLesson(pubsub, activeLessonId, studentId) {
        if (!await this.exists(activeLessonId))
            throw ApiError.badRequest(`No active lesson with id ${activeLessonId}`);

        if (!await studentService.exists(studentId))
            throw ApiError.badRequest(`No student with ${studentId}`);

        // if student has answer sheet (once joined and left lesson or already joined) -> set status to JOINED
        if (await studentAnswerSheetService.existsByLessonIdAndStudentId(activeLessonId, studentId)) {
            const updateRes = await studentAnswerSheetService.updateStatusByActiveLessonIdAndStudentId( activeLessonId, studentId, StudentAnswerSheetStatusEnum.JOINED );

            if (!updateRes[0]) {
                throw ApiError.badRequest(`Unable to update lesson, activeLessonId: ${activeLessonId}, studentId: ${studentId}`);
            }

            return {
                activeLesson: await this.getOneByIdAndStudentId(studentId, activeLessonId),
                answerSheet: await studentAnswerSheetService.getOneByLessonIdAndStudentId(activeLessonId, studentId)
            };
        }

        const studentAnswerSheet = await studentAnswerSheetService.createOneByLessonIdAndStudentId(activeLessonId, studentId);

        await subscribePublishService.publishStudentJoinedLeftLesson(pubsub, activeLessonId, studentId, StudentAnswerSheetStatusEnum.JOINED);

        return {
            activeLesson: await this.getOneByIdAndStudentId(studentId, activeLessonId),
            answerSheet: studentAnswerSheet
        };
    }

    async studentLeaveLesson(pubsub, activeLessonId, studentId) {
        // check if student has answer sheet
        if (!await studentAnswerSheetService.existsByLessonIdAndStudentId(activeLessonId, studentId))
            throw ApiError.badRequest(`No lesson with id ${activeLessonId}, studentId: ${studentId}`)

        // todo
        if (!await studentAnswerSheetService.getStatusByActiveLessonIdAndStudent(activeLessonId, studentId)
            .then((status) => status === StudentAnswerSheetStatusEnum.LEFT))
            throw ApiError.badRequest(`Student is not on lesson ${activeLessonId}, studentId: ${studentId}`);

        const upd = await studentAnswerSheetService.updateStatusByActiveLessonIdAndStudentId(activeLessonId, studentActiveLessonInclude,
            StudentAnswerSheetStatusEnum.LEFT);
        if (!upd[0])
            throw ApiError.badRequest(`Cannot leave lesson id: ${activeLessonId}, student id ${studentId}`);

        // notify others that student left lesson
        await subscribePublishService.publishStudentJoinedLeftLesson(pubsub, activeLessonId, studentId, StudentAnswerSheetStatusEnum.LEFT);
    }

    // teacher starts the lesson
    async startActiveLesson(pubsub, activeLessonId, teacherId) {
        // if (!await this.exists(activeLessonId))
        //     throw new Error(`No active lesson with id ${activeLessonId}`);
        //
        // if (!await teacherService.exists(teacherId))
        //     throw new Error(`No teacher with ${teacherId}`);
        const updatedResult = await ActiveLesson.update(
            { status: ActiveLessonStatusEnum.STARTED },
            {
                where: {
                    id: activeLessonId,
                    status: ActiveLessonStatusEnum.NOT_STARTED,
                    teacherId
                },
                include: teacherLessonInclude
            }
        );

        // returns array, first - number of affected rows
        if (!updatedResult[0]) {
            throw ApiError.badRequest(`Unable to update lesson`);
        }

        // notifying students that lesson resumed
        await subscribePublishService.publishActiveLessonStatusChanged(pubsub, activeLessonId, { status: ActiveLessonStatusEnum.STARTED });

        return await this.getOneByIdAndTeacherId(teacherId, activeLessonId);
    }

    // teacher finishes the lesson
    async finishActiveLesson(pubsub, activeLessonId, teacherId) {
        // if teacher is not the host nothing is returned
        const updatedResult = await ActiveLesson.update(
            { status: ActiveLessonStatusEnum.FINISHED },
            {
                where: {
                    id: activeLessonId,
                    status: ActiveLessonStatusEnum.STARTED,
                    teacherId
                },
                include: teacherLessonInclude
            }
        );

        // returns array, first - number of affected rows
        if (!updatedResult[0]) {
            throw ApiError.badRequest(`Unable to update lesson`);
        }

        // notifying students that lesson finished
        await subscribePublishService.publishActiveLessonStatusChanged(pubsub, activeLessonId, { status: ActiveLessonStatusEnum.FINISHED });

        return await this.getOneByIdAndTeacherId(teacherId, activeLessonId);
    }

    // teacher resumes finished lesson
    async resumeActiveLesson(pubsub, activeLessonId, teacherId) {
        // if teacher is not the host nothing is returned
        // if the status is finished, reset it and publish event

        const updatedResult = await ActiveLesson.update(
            { status: ActiveLessonStatusEnum.STARTED },
            {
                where: {
                    id: activeLessonId,
                    status: ActiveLessonStatusEnum.FINISHED,
                    teacherId
                }
            }
        );
        // returns array, first - number of affected rows
        if (!updatedResult[0]) {
            throw ApiError.badRequest(`Unable to update lesson`);
        }

        // notifying students that lesson resumed
        await subscribePublishService.publishActiveLessonStatusChanged(pubsub, activeLessonId, { status: ActiveLessonStatusEnum.STARTED });

        return await this.getOneByIdAndTeacherId(teacherId, activeLessonId);
    }

    // todo: publish student enter answer event
    async changeStudentAnswer(activeLessonId, activeTaskId, activeSentenceId, activeOptionId, studentId) {

    }

    async showAllRightAnswersForTask(activeLessonId, taskId, teacherId) {

    }

    // todo: publish teacher showed right answer event
    async showRightAnswerForGap(pubsub, activeLessonId, taskId, gapId, teacherId) {
        // check for teacher on lesson and lesson is started
        if (!await this.existsStartedByIdAndTeacherId(activeLessonId, teacherId))
            throw ApiError.badRequest(`No lesson exists lessonId: ${activeLessonId}, teacherId: ${teacherId}`);

        if (!await activeTaskService.existsByIdAndLessonId(taskId, activeLessonId))
            throw ApiError.badRequest(`No task with id ${taskId}`);
        if (!await activeGapService.existsByIdAndTaskId(gapId, taskId))
            throw ApiError.badRequest(`No gap with id ${gapId}`);

        if (await activeGapService.isAnswerShown(gapId))
            throw ApiError.badRequest(`Answer already shown for gap ${gapId}`);

        await activeGapService.setAnswerShown(gapId, true);

        await subscribePublishService.publishTeacherShowedAnswer(pubsub, activeLessonId, taskId, gapId);
    }

    async hideAllRightAnswersForTask(activeLessonId, taskId, teacherId) {

    }

    async hideRightAnswerForGap(activeLessonId, taskId, gapId, teacherId) {

    }

    async getActiveLessonByTeacherId(teacherId) {
        return ActiveLesson.findOne({ where: { teacherId } })
    }

    async getActiveLessonByStudentId(studentId) {
        return StudentAnswerSheet.findOne({ where: { studentId } })
    }

    // test change for setup
    async studentChangedActiveLesson(pubsub, studentId) {
        const activeLessonId = this.getActiveLessonByStudentId(studentId);

        await subscribePublishService.publishStudentChangedActiveLesson(pubsub, activeLessonId, { studentId });
    }

    async subscribeStudentOnActiveLessonStatusChanged(pubsub, activeLessonId, studentId) {
        // if activeLessonId or student is not on lesson does not exist throw error
        if (!await studentAnswerSheetService.existsByLessonIdAndStudentId(activeLessonId, studentId))
            throw ApiError.badRequest(`No active lesson, lessonId: ${activeLessonId}, studentId: ${studentId}`);

        if (await studentAnswerSheetService.getStatusByActiveLessonIdAndStudent(activeLessonId, studentId) !== StudentAnswerSheetStatusEnum.JOINED)
            throw ApiError.badRequest(`Student has not joined lesson, lessonId: ${activeLessonId}, studentId: ${studentId}`);

        return subscribePublishService.subscribeStudentOnActiveLessonStatusChanged(pubsub, activeLessonId);
    }

    async subscribeStudentOnTeacherShowedAnswer(pubsub, activeLessonId, studentId) {
        // if activeLessonId or student is not on lesson does not exist throw error
        if (!await studentAnswerSheetService.existsByLessonIdAndStudentId(activeLessonId, studentId))
            throw ApiError.badRequest(`No active lesson, lessonId: ${activeLessonId}, studentId: ${studentId}`);
        if (!await this.existsStartedById(activeLessonId))
            throw ApiError.badRequest(`Lesson is not started ${activeLessonId}`);

        return subscribePublishService.subscribeStudentOnTeacherShowedAnswer(pubsub, activeLessonId);
    }

    async subscribeTeacherOnStudentEnterAnswer(pubsub, activeLessonId, teacherId) {
        if (!await this.existsStartedByIdAndTeacherId(activeLessonId, teacherId))
            throw ApiError.badRequest(``)
    }

    async subscribeTeacherOnStudentJoinedLeftLesson(pubsub, activeLessonId, teacherId) {

    }

    // test change for setup
    async teacherChangedActiveLesson(pubsub, teacherId, teacherMessage) {
        const activeLessonId = this.getActiveLessonByTeacherId(teacherId);

        await subscribePublishService.publishTeacherChangedActiveLesson(pubsub,
            activeLessonId,
            { teacherChangedLesson: { message: teacherMessage } });
    }

    // test change for setup
    async subscribeToTeacherChangedActiveLesson(pubsub, studentId) {
        const activeLessonId = this.getActiveLessonByStudentId(studentId);

        return await subscribePublishService.subscribeToTeacherChangedActiveLesson(pubsub, activeLessonId);
    }

    // test change for setup
    async subscribeToStudentChangedActiveLesson(pubsub, teacherId) {
        const activeLessonId = this.getActiveLessonByTeacherId(teacherId);

        return await subscribePublishService.subscribeToStudentChangedActiveLesson(pubsub, activeLessonId);
    }
}

module.exports = new ActiveLessonService();
