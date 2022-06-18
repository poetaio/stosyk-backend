const {Course, TeacherCourse} = require("../../models");

class CourseService {
    async createCourse(name, teacherId){
        const newCourse = await Course.create({name});
        await TeacherCourse.create({courseId: newCourse.courseId, teacherId});
        return newCourse.courseId
    }
}

module.exports = new CourseService();
