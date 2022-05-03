const { lessonService, studentService, userService} = require('../../services')
const teacherService = require("../../services/user/teacherService");
const {ValidationError} = require("../../utils");
const {pubsubService} = require('../../services');

class LessonController {
    async createLesson({ lesson }, { user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await lessonService.create(lesson, teacher.teacherId);
    }

    async getTeacherLessons({ where, page, limit }, { user : { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await lessonService.getTeacherLessons(teacher.teacherId, where, page, limit);
    }

    async getStudentLesson({lessonId}, { user: { userId } }) {
        const student = await studentService.findOneByUserId(userId);

        if(!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await lessonService.getStudentLesson(lessonId, student.studentId);
    }

    async startLesson({lessonId}, { pubsub, user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await lessonService.startLesson(pubsub, lessonId, teacher.teacherId);
    }

    async finishLesson({lessonId}, { pubsub, user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await lessonService.finishLesson(pubsub, lessonId, teacher.teacherId)
    }

    async deleteLesson({ lessonId }, { user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await lessonService.deleteLesson(lessonId, teacher.teacherId);
    }

    async joinLesson({ lessonId }, {pubsub, user: {userId}}) {
        const student = await studentService.findOneByUserId(userId);

        if(!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await lessonService.joinLesson(pubsub, lessonId, student.studentId);
    }

    async setStudentCurrentPosition({lessonId, taskId}, {pubsub, user: {userId}}){
        const student = await studentService.findOneByUserId(userId);
        if(!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await lessonService.setStudentCurrentPosition(pubsub, lessonId, taskId, student);
    }

    async getStudentCurrentPosition({lessonId}, {pubsub, user: {userId}}){
        const teacher = await teacherService.findOneByUserId(userId);
        if(!teacher){
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        return await pubsubService.subscribeOnStudentPosition(pubsub, teacher.teacherId, lessonId)
    }

    async setAnswer({lessonId, answer: { gapId, optionId }}, { pubsub, user: {userId}}, ) {
        const student = await studentService.findOneByUserId(userId);

        if(!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await lessonService.setAnswer(pubsub, lessonId, gapId, student.studentId, optionId)
    }

    async presentStudentsChanged({ lessonId }, { pubsub, user: {userId}}) {
        setTimeout(async ()=> await pubsubService.publishOnPresentStudentsChanged(pubsub, lessonId, userId,
            await studentService.studentsLesson(lessonId)),0)
       return await pubsubService.subscribeOnPresentStudentsChanged(pubsub, userId, lessonId);

    }

    async studentAnswersChanged({ lessonId }, { pubsub, user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await lessonService.subscribeOnStudentAnswersChanged(pubsub, lessonId, teacher.teacherId);
    }

    async lessonStarted({ lessonId }, { pubsub }) {
        return await lessonService.subscribeOnLessonStarted(pubsub, lessonId);
    }

    async correctAnswerShown({ lessonId }, { pubsub, user: { userId } }) {
        const student = await studentService.findOneByUserId(userId);
        if(!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await lessonService.subscribeOnCorrectAnswersShown(pubsub, lessonId, student.studentId);
    }
}


module.exports = new LessonController();
