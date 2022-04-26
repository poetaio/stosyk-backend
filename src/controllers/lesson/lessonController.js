const { lessonService, studentService} = require('../../services')
const teacherService = require("../../services/user/teacherService");
const {ValidationError} = require("../../utils");

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

    async startLesson({lessonId}, { user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await lessonService.startLesson(lessonId, teacher.teacherId);
    }

    async finishLesson({lessonId}, { user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await lessonService.finishLesson(lessonId, teacher.teacherId)
    }

    async deleteLesson({ lessonId }, { user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await lessonService.deleteLesson(lessonId, teacher.teacherId);
    }

    async joinLesson({ lessonId }, {user: {userId}}) {
        const student = await studentService.findOneByUserId(userId);

        if(!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await lessonService.joinLesson(lessonId, student.studentId);
    }

    async setAnswer({lessonId, answer: {optionId}}, {user: {userId}}, ) {
        const student = await studentService.findOneByUserId(userId);

        if(!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return lessonService.setAnswer(lessonId, student.studentId, optionId)
    }

    async presentStudentsChanged({ lessonId }, { pubsub }) {
        return pubsub.asyncIterator([`PresentStudentsChanged${lessonId}`]);
        // return [{
        //     id: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
        //     name: 'Jordgje'
        // }];
    }

    async studentAnswerChanged({ lessonId }, { pubsub }) {
        return pubsub.asyncIterator([`StudentAnswerChanged${lessonId}`]);
        // return [{
        //     taskId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
        //     sentences: [{
        //         sentenceId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
        //         gaps: [{
        //             gapId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
        //             studentAnswers: [{
        //                 studentId: '59d9c6c4-aa93-40e7-ba30-7de589766e82',
        //                 optionId: '59d9c6c4-aa93-40e7-ba30-7de589766e82'
        //             }]
        //         }]
        //     }]
        // }];
    }

    async lessonStatusChanged({ lessonId }, { pubsub }) {
        return pubsub.asyncIterator([`LessonStatusChanged${lessonId}`]);
    }

    async correctAnswerShown({ lessonId }, { pubsub }) {
        return pubsub.asyncIterator([`CorrectAnswersShown${lessonId}`]);
    }
}


module.exports = new LessonController();
