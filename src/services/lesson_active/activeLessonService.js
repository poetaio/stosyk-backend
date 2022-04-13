const subscribePublishService = require('../subscribePublishService');
const { ActiveLesson } = require("../../models");
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
const studentAnswerService = require('./studentAnswerService');


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

    async getOneByIdAndStudentId(studentId, activeLessonId) {
        // if lesson doesn't exist or student left lesson
        if (!await studentAnswerSheetService.existsActiveByLessonIdAndStudentId(activeLessonId, studentId))
            throw ApiError.badRequest(`No such activeLesson ${activeLessonId} ${studentId}`);

        const activeLesson = await ActiveLesson.findOne({
            where: { id: activeLessonId },
            include: studentActiveLessonInclude
        });

        if (!activeLesson)
            return null;

        // if right answer is not shown set it to null
        for (let task of activeLesson.tasks) {
            for (let gap of task.gaps) {
                if (!gap.answerShown)
                    gap.rightOption = null;
            }
        }

        return activeLesson;
    }

    async getOneByIdAndTeacherId(teacherId, activeLessonId) {
        const activeLesson = await ActiveLesson.findOne({
            where: { id: activeLessonId, teacherId },
            include: teacherLessonInclude
        });

        if (!activeLesson)
            return null;
            // throw Error("No active lesson with such id");

        // activeLesson.tasks.gaps.answers.answerSheet.student
        /* todo: refactor
            1. rewrite include (answer->answerSheet->student ---->  answer->student
            2. make triple relation through answerSheet (activeLesson-student  ----> activeLesson-student-answers)
         */
        for (let task of activeLesson.tasks) {
            for (let gap of task.gaps) {
                for (let answer of gap.studentsAnswers) {
                    answer.student = answer.answerSheet.student;
                }
            }
        }

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
            await studentAnswerSheetService.updateStatusByActiveLessonIdAndStudentId( activeLessonId, studentId, StudentAnswerSheetStatusEnum.JOINED );

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
        // check if student has answer sheet and student is on lesson
        if (!await studentAnswerSheetService.existsActiveByLessonIdAndStudentId(activeLessonId, studentId))
            throw ApiError.badRequest(`No lesson with id ${activeLessonId}, studentId: ${studentId}`)

        // if (!await studentAnswerSheetService.getStatusByActiveLessonIdAndStudent(activeLessonId, studentId)
        //     .then((status) => status === StudentAnswerSheetStatusEnum.LEFT))
        //     throw ApiError.badRequest(`Student is not on lesson ${activeLessonId}, studentId: ${studentId}`);

        await studentAnswerSheetService.updateStatusByActiveLessonIdAndStudentId(activeLessonId, studentActiveLessonInclude,
            StudentAnswerSheetStatusEnum.LEFT);

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
        const activeLesson = await this.getOneByIdAndTeacherId(teacherId, activeLessonId);

        if (!activeLesson)
            return null;

        if (activeLesson.status === ActiveLessonStatusEnum.STARTED)
            return activeLesson;

        await ActiveLesson.update(
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

        // notifying students that lesson resumed
        await subscribePublishService.publishActiveLessonStatusChanged(pubsub, activeLessonId, { status: ActiveLessonStatusEnum.STARTED });

        return await this.getOneByIdAndTeacherId(teacherId, activeLessonId);
    }

    // teacher finishes the lesson
    async finishActiveLesson(pubsub, activeLessonId, teacherId) {
        // if teacher is not the host -> null
        // if the lesson already finished -> no update, no subscription publishing
        const activeLesson = await this.getOneByIdAndTeacherId(activeLessonId, teacherId);

        if (!activeLesson)
            return null;

        if (activeLesson.status === ActiveLessonStatusEnum.FINISHED)
            return activeLesson;

        await ActiveLesson.update(
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

        // notifying students that lesson finished
        await subscribePublishService.publishActiveLessonStatusChanged(pubsub, activeLessonId, { status: ActiveLessonStatusEnum.FINISHED });

        return await this.getOneByIdAndTeacherId(teacherId, activeLessonId);
    }

    // teacher resumes finished lesson
    async resumeActiveLesson(pubsub, activeLessonId, teacherId) {
        // if teacher is not the host nothing is returned
        // if the status is finished, reset it and publish event
        const activeLesson = await this.getOneByIdAndTeacherId(activeLessonId, teacherId);

        if (!activeLesson)
            return null;

        if (activeLesson.status !== ActiveLessonStatusEnum.FINISHED)
            return activeLesson;

        await ActiveLesson.update(
            { status: ActiveLessonStatusEnum.STARTED },
            {
                where: {
                    id: activeLessonId,
                    status: ActiveLessonStatusEnum.FINISHED,
                    teacherId
                }
            }
        );

        // notifying students that lesson resumed
        await subscribePublishService.publishActiveLessonStatusChanged(pubsub, activeLessonId, { status: ActiveLessonStatusEnum.STARTED });

        return await this.getOneByIdAndTeacherId(teacherId, activeLessonId);
    }

    async changeStudentAnswer(pubsub, activeLessonId, activeTaskId, activeGapId, activeOptionId, studentId) {
        // if student not on a lesson
        if (!await studentAnswerSheetService.existsActiveByLessonIdAndStudentId(activeLessonId, studentId))
            throw ApiError.badRequest(`No activeLesson with id: ${activeLessonId}, studentId: ${studentId}`)

        if (!await activeTaskService.existsByIdAndLessonId(activeTaskId, activeLessonId))
            throw ApiError.badRequest(`No task with id: ${activeTaskId}`);
        if (!await activeGapService.existsByIdAndTaskId(activeGapId, activeTaskId))
            throw ApiError.badRequest(`No gap with id: ${activeGapId}`);
        if (!await activeOptionService.existsByIdAndGapId(activeOptionId, activeGapId))
            throw ApiError.badRequest(`No option with id: ${activeOptionId}`);

        const answerSheet = await studentAnswerSheetService.getOneByLessonIdAndStudentId(activeLessonId, studentId);

        const updated = await studentAnswerService.createOrUpdateIfExists(answerSheet.id, activeGapId, activeOptionId);
        const studentAnswer = await studentAnswerService.getOneByAnswerSheetIdAndActiveGapId(answerSheet.id, activeGapId);
        const student = await studentService.getOneById(studentId);

        // if updated then publish for a teacher
        if (updated)
            await subscribePublishService.publishStudentEnteredAnswer(pubsub, activeLessonId, {
                student, activeTaskId, activeGapId, chosenOption: studentAnswer.chosenOption
            });

        // return chosen option anyway
        return studentAnswer.chosenOption;
    }

    // todo: publish teacher showed right answer event
    async showRightAnswerForGap(pubsub, activeLessonId, taskId, gapId, teacherId) {
        // check for teacher on lesson and lesson is started
        if (!await this.existsStartedByIdAndTeacherId(activeLessonId, teacherId))
            throw ApiError.badRequest(`No lesson exists lessonId: ${activeLessonId}, teacherId: ${teacherId}`);

        // if no such task or gap
        if (!await activeTaskService.existsByIdAndLessonId(taskId, activeLessonId))
            throw ApiError.badRequest(`No task with id ${taskId}`);
        if (!await activeGapService.existsByIdAndTaskId(gapId, taskId))
            throw ApiError.badRequest(`No gap with id ${gapId}`);

        // if answer already shown
        if (await activeGapService.isAnswerShown(gapId))
            throw ApiError.badRequest(`Answer already shown for gap ${gapId}`);

        await activeGapService.setAnswerShown(gapId, true);

        await subscribePublishService.publishTeacherShowedHidAnswer(pubsub, activeLessonId, { taskId, gapId });
    }

    async showAllRightAnswersForTask(pubsub, activeLessonId, taskId, teacherId) {
        /* todo: send right answer if it is shown
            when student joined lesson
            (change student joined lesson method (includes))
         */
        // check for teacher on lesson and lesson is started
        if (!await this.existsStartedByIdAndTeacherId(activeLessonId, teacherId))
            throw ApiError.badRequest(`No lesson exists lessonId: ${activeLessonId}, teacherId: ${teacherId}`);

        // if no such task
        if (!await activeTaskService.existsByIdAndLessonId(taskId, activeLessonId))
            throw ApiError.badRequest(`No task with id ${taskId}`);

        // getting task with gaps, where answer not shown
        const task = await activeTaskService.getOneByIdWithGapsWithHiddenAnswer(taskId);
        // if gaps arr is empty, then all answers are shown
        if (!task.gaps?.length)
            return false;

        for (let { id : gapId } of task.gaps) {
            await activeGapService.setAnswerShown(gapId, true);
        }

        await subscribePublishService.publishTeacherShowedHidAnswer(pubsub, activeLessonId, {
            taskId,
            action: "SHOWED"
        });

        return true;
    }

    async hideRightAnswerForGap(activeLessonId, taskId, gapId, teacherId) {

    }

    async hideAllRightAnswersForTask(pubsub, activeLessonId, taskId, teacherId) {
        // check for teacher on lesson and lesson is started
        if (!await this.existsStartedByIdAndTeacherId(activeLessonId, teacherId))
            throw ApiError.badRequest(`No lesson exists lessonId: ${activeLessonId}, teacherId: ${teacherId}`);

        // if no such task or gap
        if (!await activeTaskService.existsByIdAndLessonId(taskId, activeLessonId))
            throw ApiError.badRequest(`No task with id ${taskId}`);

        // getting task with gaps, where answer shown
        const task = await activeTaskService.getOneByIdWithGapsWithShownAnswer(taskId);
        // if gaps arr is empty, then all answers are hidden
        if (!task.gaps.length)
            return false;

        for (let { id : gapId } of task.gaps) {
            await activeGapService.setAnswerShown(gapId, false);
        }

        await subscribePublishService.publishTeacherShowedHidAnswer(pubsub, activeLessonId, {
            taskId,
            action: "HID"
        });

        return true;
    }

    async subscribeStudentOnActiveLessonStatusChanged(pubsub, activeLessonId, studentId) {
        // if activeLessonId or student is not on lesson does not exist throw error
        if (!await studentAnswerSheetService.existsActiveByLessonIdAndStudentId(activeLessonId, studentId))
            throw ApiError.badRequest(`No active lesson, lessonId: ${activeLessonId}, studentId: ${studentId}`);

        if (await studentAnswerSheetService.getStatusByActiveLessonIdAndStudent(activeLessonId, studentId) !== StudentAnswerSheetStatusEnum.JOINED)
            throw ApiError.badRequest(`Student has not joined lesson, lessonId: ${activeLessonId}, studentId: ${studentId}`);

        return subscribePublishService.subscribeStudentOnActiveLessonStatusChanged(pubsub, activeLessonId);
    }

    async subscribeStudentOnTeacherShowedHidAnswer(pubsub, activeLessonId, studentId) {
        // if activeLessonId or student is not on lesson does not exist throw error
        if (!await studentAnswerSheetService.existsActiveByLessonIdAndStudentId(activeLessonId, studentId))
            throw ApiError.badRequest(`No active lesson, lessonId: ${activeLessonId}, studentId: ${studentId}`);
        if (!await this.existsStartedById(activeLessonId))
            throw ApiError.badRequest(`Lesson is not started ${activeLessonId}`);

        return subscribePublishService.subscribeStudentOnTeacherShowedAnswer(pubsub, activeLessonId);
    }

    async subscribeTeacherOnStudentEnterAnswer(pubsub, activeLessonId, teacherId) {
        // check if teacher is the host and lesson is ongoing
        if (!await this.existsStartedByIdAndTeacherId(activeLessonId, teacherId))
            throw ApiError.badRequest(`No active lesson with id ${activeLessonId}, teacherId: ${teacherId}`);

        return subscribePublishService.subscribeTeacherOnStudentEnterAnswer(pubsub, activeLessonId);
    }

    async subscribeTeacherOnStudentJoinedLeftLesson(pubsub, activeLessonId, teacherId) {

    }
}

module.exports = new ActiveLessonService();
