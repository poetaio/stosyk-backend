const {ValidationError} = require("../../utils");
const {
    teacherService,
    studentService,
    homeworkService,
    markupService,
    lessonService,
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

        // todo: refactor somehow
        //       removing homework from protege hw list
        //       copying protege's homework to markup
        //       and recreating the whole protege
        await homeworkService.removeFromLesson(teacher.teacherId, lessonId, homeworkId);

        const allMarkupHomeworks = await homeworkService.getAllByLessonMarkupId(lessonMarkupId);
        for (const {homeworkId} of allMarkupHomeworks) {
            await homeworkService.removeFromLessonMarkup(teacher.teacherId, lessonMarkupId, homeworkId);
        }

        const newHomeworkList = await homeworkService.getFullHomeworkByLessonId(lessonId);
        newHomeworkList.map(homework => homework.tasks = homework.taskList?.tasks || []);
        await homeworkService.addHomeworkListToLessonMarkupRaw(lessonMarkupId, newHomeworkList);

        await lessonService.recreateLessonProtegeByProtegeId(lessonId);

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

    async editHomework({homeworkId, homework: { tasks }}, {user: { userId }}) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        const lesson = await lessonService.getLessonByHomeworkId(homeworkId);
        if (!lesson) {
            throw new ValidationError(`No homework with id ${homeworkId} found`);
        }
        const {lessonId} = lesson;

        await markupService.checkIfLessonIsProtegeAndBelongsToTeacher(lessonId, teacher.teacherId);

        await this.removeFromLesson({lessonId, homeworkId}, {user: {userId}});
        await this.addHomeworkToLesson({lessonId, homework: {tasks} }, {user: {userId}});

        return true;
    }
}

module.exports = new HomeworkController();