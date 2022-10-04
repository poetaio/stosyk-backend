const teacherService = require("../../services/user/teacherService");
const {ValidationError} = require("../../utils");
const {courseService, markupService, lessonService} = require("../../services");
const {Course} = require("../../db/models");
const {schoolService} = require("../../services/school");

class CourseController {
    async createCourse({name}, {user: {userId}}){
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        const school = await schoolService.getOneByTeacherId(teacher.teacherId);

        return await courseService.createCourse(name, teacher.teacherId, school.schoolId);
    }

    async addLessonToCourse({courseId, lessonId}, {user: {userId}}){
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        const {teacherId} = teacher;

        await markupService.checkIfLessonIsProtegeAndBelongsToTeacher(lessonId, teacherId);

        const {lessonMarkupId} = await markupService.getMarkupByLessonId(lessonId);

        return await courseService.addLessonMarkupToCourse(courseId, lessonMarkupId, teacher.teacherId)
    }

    async removeLessonFromCourse({courseId, lessonId}, {user: {userId}}){
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        const {teacherId} = teacher;

        await markupService.checkIfLessonIsProtegeAndBelongsToTeacher(lessonId, teacherId);

        const {lessonMarkupId} = await markupService.getMarkupByLessonId(lessonId);

        return await courseService.removeLessonMarkupFromCourse(courseId, lessonMarkupId, teacherId);
    }

    async getAllCourses({user:{userId}}){
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await courseService.getAllCourses(teacher.teacherId);
    }

    async deleteCourse({courseId}, {user:{userId}}){
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await courseService.deleteCourse(courseId, teacher.teacherId);
    }

    async renameCourse({courseId, newName}, {user:{userId}}){
        const teacher = await teacherService.findOneByUserId(userId);

        if(!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await courseService.renameCourse(courseId, teacher.teacherId, newName)
    }

    async getAllStudentsWhoTookLessons({courseId}) {
        const students = await courseService.getAllStudentsWhoTookLessons(courseId);
        // adding courseId cause it's required for StudentWithCourseResultsType
        return students.map(studentModel => {
            const student = studentModel.get({plain: true});
            student.courseId = courseId;
            return student;
        });
    }

    async getTotalScore({courseId, studentId}) {
        return await courseService.getTotalScore(courseId, studentId);
    }

    async getStudentProgress({courseId, studentId}) {
        return await courseService.getStudentProgress(courseId, studentId);
    }

    async getLessonsByCourseForStudent({courseId, studentId}) {
        const markups = await lessonService.getMarkupsByCourse(courseId);
        const lessons = await Promise.all(
            markups.map(({lessonMarkupId}) =>
                markupService.getLastLessonStudentTookByMarkup(lessonMarkupId, studentId)
        ));

        // adding courseId to lessons, cause it's required by StudentWithCourseResultsType
        return lessons
            .filter(lesson => lesson !== null)
            .map((lesson) => ({...lesson, courseId, studentId}));
    }

    async getCoursesBySchoolId({schoolId}) {
        return await Course.findAll({
            where: {schoolId},
        });
    }
}

module.exports = new CourseController();
