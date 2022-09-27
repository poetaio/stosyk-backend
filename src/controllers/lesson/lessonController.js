const {
    lessonService,
    studentService,
    answerService,
    markupService,
    pubsubService,
    scoreService,
    studentLessonService,
} = require('../../services');
const {LessonMarkup, allLessonsBySchoolIdInclude} = require("../../db/models");
const teacherService = require("../../services/user/teacherService");
const {ValidationError, NotFoundError} = require("../../utils");

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

        await markupService.checkIfLessonIsProtegeAndBelongsToTeacher(lessonId, teacher.teacherId);

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
       return await lessonService.getStudentCurrentPosition(pubsub, lessonId, userId)
    }

    async setAnswer({ answer }, { pubsub, user: {userId}}, ) {
        const student = await studentService.findOneByUserId(userId);

        if(!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await answerService.setAnswer(pubsub, student.studentId, answer)
    }

    async presentStudentsChanged({ lessonId }, { pubsub, user: {userId}}) {
        setTimeout(async ()=> await pubsubService.publishOnPresentStudentsChanged(pubsub, lessonId, userId,
            await studentLessonService.getLessonStudents(lessonId)),0)

       return await pubsubService.subscribeOnPresentStudentsChanged(pubsub, userId, lessonId);
    }

    async studentAnswersChanged({ lessonId }, { pubsub, user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await lessonService.subscribeOnStudentAnswersChanged(pubsub, lessonId, teacher.teacherId);
    }

    async lessonStatusChanged({ lessonId }, { pubsub }) {
        if(!await lessonService.lessonExists(lessonId)){
            throw new NotFoundError(`No lesson ${lessonId}`)
        }

        return await lessonService.subscribeOnLessonStatus(pubsub, lessonId);
    }

    async correctAnswerShown({ lessonId }, { pubsub, user: { userId } }) {
        const student = await studentService.findOneByUserId(userId);
        if(!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await lessonService.subscribeOnCorrectAnswersShown(pubsub, lessonId, student.studentId);
    }

    async studentLeaveLesson({ lessonId }, {pubsub,  user: { userId } }){
        const student = await studentService.findOneByUserId(userId);
        if(!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await lessonService.studentLeaveLesson(pubsub, lessonId, student.studentId);
    }

    /**
     * Checks if user is student and returns all tasks by lessonId, student's answers are resolved in every task type
     * @param lessonId
     * @param userId
     * @return {Promise<*[]>} all tasks by lesson id
     */
    async studentGetAnswers({lessonId}, {user: {userId}}){
        const student = await studentService.findOneByUserId(userId);
        if(!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await lessonService.studentGetAnswers(lessonId);
    }

    async getLessonsByCourse({courseId}, args, context){
        return await lessonService.getLessonsByCourse(courseId)
    }

    async setHomeworkAnswer({ answer }, { pubsub, user: {userId}}, ) {
        const student = await studentService.findOneByUserId(userId);

        if(!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await answerService.setHomeworkAnswer(pubsub, student.studentId, answer)
    }

    async editLesson({lessonId, lesson}, {user: {userId}}) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        await markupService.checkIfLessonIsProtegeAndBelongsToTeacher(lessonId, teacher.teacherId);

        return await lessonService.editLesson(lessonId, lesson);
    }

    // complete = answered / correct
    async getStudentProgress({ studentId, lessonId }) {
        return await scoreService.getStudentProgress(lessonId, studentId);
    }

    // correctness = correct / answered
    async getStudentCorrectness({ studentId, parent: {lessonId} }) {
        return await scoreService.getStudentScore(lessonId, studentId);
    }

    // total score = correct / total
    async getTotalScore({ studentId, lessonId }) {
        return await scoreService.getTotalScore(lessonId, studentId);
    }

    async getTeacherLessonHistory({ user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return lessonService.getLessonsRunByTeacher(teacher.teacherId);
    }

    async studentOnLesson({ lessonId }, { user: {userId}, pubsub }) {
        const student = await studentService.findOneByUserId(userId);

        if(!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        await lessonService.joinLesson(pubsub, lessonId, student.studentId);
        return await lessonService.subscribeOnStudentOnLesson(pubsub, lessonId, student.studentId);
    }

    async getStudents({lessonId}) {
        return await lessonService.getStudents(lessonId);
    }

    async getLessonsBySchoolId({schoolId}) {
        const markups = await LessonMarkup.findAll({
            include: allLessonsBySchoolIdInclude(schoolId),
        });

        const lessons = await Promise.all(
            markups.map(({lessonMarkupId}) =>
                lessonService.getLessonsByMarkup(lessonMarkupId)
        ));
        return lessons.flat();
    }
}


module.exports = new LessonController();
