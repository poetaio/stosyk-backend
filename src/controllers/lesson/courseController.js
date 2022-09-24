const teacherService = require("../../services/user/teacherService");
const {ValidationError, NotFoundError} = require("../../utils");
const {courseService, lessonTeacherService, markupService} = require("../../services");

class CourseController {
    async createCourse({name}, {user: {userId}}){
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await courseService.createCourse(name, teacher.teacherId);
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
}

module.exports = new CourseController();
