const {ValidationError} = require("../../utils");
const {
    teacherService,
    studentService,
    homeworkService,
    markupService,
} = require("../../services");

class HomeworkController {
    async addHomeworkToLesson({lessonId, homework}, { user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        const {teacherId} = teacher;

        await markupService.checkIfLessonIsProtegeAndBelongsToTeacher(lessonId, teacherId);

        const {lessonMarkupId} = await markupService.getMarkupByLessonId(lessonId);

        // Adding homework both to lesson and its protege
        await homeworkService.addToLessonMarkup(lessonMarkupId, homework);
        await homeworkService.addToLesson(lessonId, homework);
        return true;
    }

    async removeFromLesson({lessonId, homeworkId}, {user: {userId}}) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        const {teacherId} = teacher;

        await markupService.checkIfLessonIsProtegeAndBelongsToTeacher(lessonId, teacherId);
        const {lessonMarkupId} = await markupService.getMarkupByLessonId(lessonId);

        await homeworkService.removeFromLesson(teacher.teacherId, lessonId, homeworkId);
        await homeworkService.removeFromLessonMarkup(teacher.teacherId, lessonMarkupId, homeworkId);
        return true;
    }

    async delete({homeworkId}, {user: {userId}}) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await homeworkService.delete(teacher.teacherId, homeworkId);
    }

    async getAllForTeacher({ where: {homeworkId, lessonId} }, { user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await homeworkService.getAllByLessonIdOrHomeworkIdForTeacher(teacher.teacherId, homeworkId, lessonId);
    }

    async getAllForStudent({ where: {homeworkId, lessonId} }, { user: { userId } }) {
        const student = await studentService.findOneByUserId(userId);

        if (!student)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await homeworkService.getAllByLessonIdOrHomeworkIdForStudent(student.studentId, homeworkId, lessonId);
    }

    async getAllByLessonId({lessonId}) {
        return await homeworkService.getAllByLessonId(lessonId);
    }

    async getStudents({ homeworkId }) {
        return await homeworkService.getStudents(homeworkId);
    }

    // complete = answered / correct
    async getStudentProgress({ studentId, homeworkId }) {
        return await homeworkService.getStudentCompleteness(homeworkId, studentId);
    }

    // correctness = correct / answered
    async getStudentCorrectness({ studentId, parent: {homeworkId} }) {
        return await homeworkService.getStudentScore(homeworkId, studentId);
    }

    // total score = correct / total
    async getTotalScore({ studentId, homeworkId }) {
        return await homeworkService.getTotalScore(homeworkId, studentId);
    }

    async showAnswers({homeworkId}, {user: {userId}}) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await homeworkService.showAnswers(teacher.teacherId, homeworkId);
    }
}

module.exports = new HomeworkController();