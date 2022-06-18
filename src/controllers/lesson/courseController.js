const teacherService = require("../../services/user/teacherService");
const {ValidationError} = require("../../utils");
const {courseService} = require("../../services");

class CourseController {
    async createCourse({name}, {user: {userId}}){
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        return await courseService.createCourse(name, teacher.teacherId);
    }
}

module.exports = new CourseController();
