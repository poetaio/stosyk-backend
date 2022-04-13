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

    async getActiveLessonStudentsIds(teacherId, activeLessonId) {
        const activeLesson = await ActiveLesson.findOne(
            {
                where: { teacherId, id: activeLessonId },
                include: 'students'
            }
        );

        if (!activeLesson)
            throw ApiError.badRequest(`No activeLesson id: ${activeLessonId}, teacherId: ${teacherId}`);

        const studentsIds = [];
        console.log(activeLesson.students);
        // cannot map :( sorry
        for (let { id } of activeLesson.students || []) {
            studentsIds.push(id);
        }

        return studentsIds;
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

        // if student already on lesson
        // return info, without publishing joining
        if (await studentAnswerSheetService.existsActiveByLessonIdAndStudentId(activeLessonId, studentId))
            return {
                // if lesson is not active, only old answers are returned, lesson full info is not sent
                activeLesson: await this.getOneByIdAndStudentId(studentId, activeLessonId),
                answerSheet: await studentAnswerSheetService.getOneActiveByLessonIdAndStudentIdIfLessonStarted(activeLessonId, studentId)
            };

        // if student has answer sheet (once joined and left lesson or already joined) -> set status to JOINED
        if (await studentAnswerSheetService.existsByLessonIdAndStudentId(activeLessonId, studentId)) {
            await studentAnswerSheetService.updateStatusByActiveLessonIdAndStudentId( activeLessonId, studentId, StudentAnswerSheetStatusEnum.JOINED );

            await subscribePublishService.publishStudentJoinedLeftLesson(pubsub, activeLessonId, {
                studentId,
                action: StudentAnswerSheetStatusEnum.JOINED
            });

            return {
                activeLesson: await this.getOneByIdAndStudentId(studentId, activeLessonId),
                answerSheet: await studentAnswerSheetService.getOneActiveByLessonIdAndStudentIdIfLessonStarted(activeLessonId, studentId)
            };
        }

        // otherwise creating new
        await studentAnswerSheetService.createOneByLessonIdAndStudentId(activeLessonId, studentId);

        await subscribePublishService.publishStudentJoinedLeftLesson(pubsub, activeLessonId, {
            studentId,
            action: StudentAnswerSheetStatusEnum.JOINED
        });

        return {
            // if lesson is not active (NOT_STARTED, FINISHED) no tasks/gaps/options info is sent
            activeLesson: await this.getOneByIdAndStudentId(studentId, activeLessonId),
            // if lesson is not started null returned
            answerSheet: await studentAnswerSheetService.getOneActiveByLessonIdAndStudentIdIfLessonStarted(activeLessonId, studentId)
        };
    }

    async studentLeaveLesson(pubsub, activeLessonId, studentId) {
        // check if student has answer sheet and student is on lesson
        if (!await studentAnswerSheetService.existsActiveByLessonIdAndStudentId(activeLessonId, studentId))
            throw ApiError.badRequest(`No lesson with id ${activeLessonId}, studentId: ${studentId}`)

        // if (!await studentAnswerSheetService.getStatusByActiveLessonIdAndStudent(activeLessonId, studentId)
        //     .then((status) => status === StudentAnswerSheetStatusEnum.LEFT))
        //     throw ApiError.badRequest(`Student is not on lesson ${activeLessonId}, studentId: ${studentId}`);

        await studentAnswerSheetService.updateStatusByActiveLessonIdAndStudentId(activeLessonId, studentId,
            StudentAnswerSheetStatusEnum.LEFT);

        // notify others that student left lesson
        await subscribePublishService.publishStudentJoinedLeftLesson(pubsub, activeLessonId, {
            studentId,
            action: StudentAnswerSheetStatusEnum.LEFT
        });
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
        for (let studentId of await this.getActiveLessonStudentsIds(teacherId, activeLessonId)) {
            // notifying students that lesson resumed
            await subscribePublishService.publishActiveLessonStatusChanged(pubsub, activeLessonId, studentId, {
                status: ActiveLessonStatusEnum.STARTED,
                ...await this.resolveActiveLessonAndStudentAnswerSheetOnLessonStarted(activeLessonId, studentId)
            });
        }

        return await this.getOneByIdAndTeacherId(teacherId, activeLessonId);
    }

    // teacher finishes the lesson
    async finishActiveLesson(pubsub, activeLessonId, teacherId) {
        // if teacher is not the host -> null
        // if the lesson already finished -> no update, no subscription publishing
        const activeLesson = await this.getOneByIdAndTeacherId(teacherId, activeLessonId);

        if (!activeLesson)
            return null;

        if (activeLesson.status === ActiveLessonStatusEnum.FINISHED || activeLesson.status === ActiveLessonStatusEnum.NOT_STARTED)
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
        for (let studentId of await this.getActiveLessonStudentsIds(teacherId, activeLessonId)) {
            // notifying students that lesson resumed
            await subscribePublishService.publishActiveLessonStatusChanged(pubsub, activeLessonId, studentId, {
                status: ActiveLessonStatusEnum.FINISHED
            });
        }

        return await this.getOneByIdAndTeacherId(teacherId, activeLessonId);
    }

    // teacher resumes finished lesson
    async resumeActiveLesson(pubsub, activeLessonId, teacherId) {
        // if teacher is not the host nothing is returned
        // if the status is finished, reset it and publish event
        const activeLesson = await this.getOneByIdAndTeacherId(teacherId, activeLessonId);

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

        for (let studentId of await this.getActiveLessonStudentsIds(teacherId, activeLessonId)) {
            // notifying students that lesson resumed
            await subscribePublishService.publishActiveLessonStatusChanged(pubsub, activeLessonId, studentId, {
                status: ActiveLessonStatusEnum.STARTED,
                ...await this.resolveActiveLessonAndStudentAnswerSheetOnLessonStarted(activeLessonId, studentId)
            });
        }

        return await this.getOneByIdAndTeacherId(teacherId, activeLessonId);
    }

    async resolveActiveLessonAndStudentAnswerSheetOnLessonStarted(activeLessonId, studentId) {
        return {
            // if lesson is not active (NOT_STARTED, FINISHED) no tasks/gaps/options info is sent
            activeLesson: await this.getOneByIdAndStudentId(studentId, activeLessonId),
            // if lesson is not started null returned
            answerSheet: await studentAnswerSheetService.getOneActiveByLessonIdAndStudentIdIfLessonStarted(activeLessonId, studentId)
        };
    }

    async changeStudentAnswer(pubsub, activeLessonId, activeTaskId, activeGapId, activeOptionId, studentId) {
        // if student not on a lesson
        if (!await studentAnswerSheetService.existsActiveByLessonIdAndStudentIdAndLessonStarted(activeLessonId, studentId))
            throw ApiError.badRequest(`No activeLesson with id: ${activeLessonId}, studentId: ${studentId}`)

        if (!await activeTaskService.existsByIdAndLessonId(activeTaskId, activeLessonId))
            throw ApiError.badRequest(`No task with id: ${activeTaskId}`);
        if (!await activeGapService.existsByIdAndTaskId(activeGapId, activeTaskId))
            throw ApiError.badRequest(`No gap with id: ${activeGapId}`);
        if (!await activeOptionService.existsByIdAndGapId(activeOptionId, activeGapId))
            throw ApiError.badRequest(`No option with id: ${activeOptionId}`);

        const answerSheet = await studentAnswerSheetService.getOneActiveByLessonIdAndStudentIdIfLessonStarted(activeLessonId, studentId);

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

        return subscribePublishService.subscribeStudentOnActiveLessonStatusChanged(pubsub, activeLessonId, studentId);
    }

    async subscribeStudentOnTeacherShowedHidAnswer(pubsub, activeLessonId, studentId) {
        // if activeLessonId or student is not on lesson does not exist throw error
        if (!await studentAnswerSheetService.existsActiveByLessonIdAndStudentIdAndLessonStarted(activeLessonId, studentId))
            throw ApiError.badRequest(`No active lesson, lessonId: ${activeLessonId}, studentId: ${studentId}`);

        return subscribePublishService.subscribeStudentOnTeacherShowedAnswer(pubsub, activeLessonId);
    }

    async subscribeTeacherOnStudentEnterAnswer(pubsub, activeLessonId, teacherId) {
        // check if teacher is the host and lesson is ongoing
        if (!await this.existsStartedByIdAndTeacherId(activeLessonId, teacherId))
            throw ApiError.badRequest(`No active lesson with id ${activeLessonId}, teacherId: ${teacherId}`);

        return subscribePublishService.subscribeTeacherOnStudentEnterAnswer(pubsub, activeLessonId);
    }

    async subscribeOnStudentJoinedLeftLesson(pubsub, activeLessonId, userId) {
        // if teacher is not the host and student is not on the lesson
        if (!await this.existsStartedByIdAndTeacherId(activeLessonId, userId) &&
            !await studentAnswerSheetService.existsActiveByLessonIdAndStudentIdAndLessonStarted(activeLessonId, userId))
            throw ApiError.badRequest(`No active lesson with id ${activeLessonId}, userId: ${userId}`);

        return subscribePublishService.subscribeOnStudentJoinedLeftLesson(pubsub, activeLessonId);
    }
}

module.exports = new ActiveLessonService();
