const subscribePublishService = require('./subscribePublishService');
const { ActiveLesson, StudentAnswerSheet } = require("../models");
const studentAnswerSheetService = require('./studentAnswerSheetService');
const StudentAnswerSheetStatusEnum = require('../models/lesson_active/utils/StudentAnswerSheetStatusEnum')
const studentService = require('./studentService');
const ActiveLessonStatusEnum = require("../models/lesson_active/utils/ActiveLessonStatusEnum");
const teacherLessonInclude = require('../models/includes/teacherActiveLessonInclude');
const ApiError = require("../error/ApiError");


class ActiveLessonService {
    async exists(activeLessonId) {
        return !!await ActiveLesson.count({ where: { id: activeLessonId } });
    }

    async getOneById(teacherId, activeLessonId) {
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
        throw new Error(`Unknown activeLesson status ${activeLesson.status}`);
    }

    // teacher creates markup, active lesson is added as well to generate link
    async create(lessonId) {
        return await ActiveLesson.create({ lessonMarkupId: lessonId });
    }

    // adds student to lesson and returns answer sheet of the student
    // todo: publish STUDENT_JOINED_LESSON
    async studentJoinLesson(pubsub, activeLessonId, studentId) {
        if (!await this.exists(activeLessonId))
            throw new Error(`No active lesson with id ${activeLessonId}`);

        if (!await studentService.exists(studentId))
            throw new Error(`No student with ${studentId}`);

        // if student has answer sheet (once joined and left lesson or already joined) -> set status to JOINED
        if (await studentAnswerSheetService.existsByLessonIdAndStudentId(activeLessonId, studentId)) {
            const answerSheet = await studentAnswerSheetService.getOneByLessonIdAndStudentId(activeLessonId, studentId);
            return await answerSheet.update( { status: StudentAnswerSheetStatusEnum.JOINED } )
        }

        return await studentAnswerSheetService.createOneByLessonIdAndStudentId(activeLessonId, studentId);
    }

    // teacher starts the lesson
    // todo: publish ACTIVE_LESSON_STATUS_CHANGED & pass status to the event
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
        return await this.getOneById(teacherId, activeLessonId);
    }

    // teacher finishes the lesson
    // todo: publish ACTIVE_LESSON_STATUS_CHANGED & pass status to the event
    async finishActiveLesson(pubsub, activeLessonId, teacherId) {
        // if teacher is not the host nothing is returned
        // const activeLesson = await this.getOneById(teacherId, activeLessonId);
        // if (!activeLesson)
        //     throw new Error(`No active lesson found`);
        //
        // // if the status is not already "finished", set it and publish event
        // if (activeLesson.status === ActiveLessonStatusEnum.STARTED) {
        //     return await ActiveLesson.update({
        //         status: ActiveLessonStatusEnum.FINISHED
        //     }, {
        //         where: { id: activeLessonId }
        //     });
        // }
        // return activeLesson;

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
        return await this.getOneById(teacherId, activeLessonId);
    }

    // teacher resumes finished lesson
    // todo: publish ACTIVE_LESSON_STATUS_CHANGED & pass status to the event
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
        return await this.getOneById(teacherId, activeLessonId);
        // return await ActiveLesson.update(
        //     { status: ActiveLessonStatusEnum.STARTED },
        //     {
        //         where: {
        //             id: activeLessonId,
        //             status: ActiveLessonStatusEnum.FINISHED,
        //             teacherId
        //         },
        //         include: teacherLessonInclude
        //     }
        // ).catch(() => {
        //     throw new Error(`No active lesson found`);
        // });
    }

    async subscribeStudentOnActiveLessonStatusChanged(activeLessonId, studentId) {

    }

    async subscribeTeacherOnActiveLessonStatusChanged(activeLessonId, teacher) {

    }

    async getStudentAnswers(activeLessonId, activeTaskId, activeSentenceId, teacherId) {

    }

    async changeStudentAnswer(activeLessonId, activeTaskId, activeSentenceId, activeOptionId, studentId) {

    }

    async isRightAnswerShown(activeLessonId, activeTaskId, activeSentenceId) {

    }

    async showRightAnswer(activeLessonId, activeTaskId, activeSentenceId, activeOptionId, studentId) {

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
