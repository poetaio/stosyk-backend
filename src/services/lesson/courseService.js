const {Course, TeacherCourse, LessonCourse} = require("../../models");
const {NotFoundError} = require("../../utils");

class CourseService {
    async createCourse(name, teacherId){
        const newCourse = await Course.create({name});
        await TeacherCourse.create({courseId: newCourse.courseId, teacherId});
        return newCourse.courseId
    }

    async teacherCourseExists(courseId, teacherId){
        return !!await TeacherCourse.count({
            where: {
                courseId,
                teacherId
            }
        });
    }

    async addLessonToCourse(courseId, lessonId, teacherId){
        if (!await this.teacherCourseExists(courseId, teacherId)) {
            throw new NotFoundError(`No course ${courseId} of such teacher ${teacherId}`);
        }
        return !! await LessonCourse.create({courseId, lessonId})
    }

    async removeLessonFromCourse(courseId, lessonId, teacherId){
        if (!await this.teacherCourseExists(courseId, teacherId)) {
            throw new NotFoundError(`No course ${courseId} of such teacher ${teacherId}`);
        }
        return  !!await LessonCourse.destroy({
            where: {
                lessonId,
                courseId,
            }
        })
    }
}

module.exports = new CourseService();
