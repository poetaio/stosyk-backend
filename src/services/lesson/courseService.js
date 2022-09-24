const {Course, TeacherCourse, LessonCourse, allCoursesByTeacherIdInclude, allLessonCoursesByMarkupIdInclude} = require("../../db/models");
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

    async addLessonMarkupToCourse(courseId, lessonMarkupId, teacherId){
        if (!await this.teacherCourseExists(courseId, teacherId)) {
            throw new NotFoundError(`No course ${courseId} of such teacher ${teacherId}`);
        }
        return !! await LessonCourse.create({courseId, lessonMarkupId})
    }

    async removeLessonMarkupFromCourse(courseId, lessonMarkupId, teacherId){
        if (!await this.teacherCourseExists(courseId, teacherId)) {
            throw new NotFoundError(`No course ${courseId} of such teacher ${teacherId}`);
        }

        return  !!await LessonCourse.destroy({
            include: allLessonCoursesByMarkupIdInclude(lessonMarkupId),
            where: {
                courseId,
            }
        })
    }

    async getAllCourses(teacherId){
        return await Course.findAll({
            include:allCoursesByTeacherIdInclude(teacherId)
        })
    }

    async deleteCourse(courseId, teacherId){
        if (!await this.teacherCourseExists(courseId, teacherId)) {
            throw new NotFoundError(`No course ${courseId} of such teacher ${teacherId}`);
        }
        await TeacherCourse.destroy({
            where: {
                courseId
            }
        })
        return  !! await Course.destroy({
            where: {
                courseId
            },
        })
    }

    async renameCourse(courseId, teacherId, newName){
        if (!await this.teacherCourseExists(courseId, teacherId)) {
            throw new NotFoundError(`No course ${courseId} of such teacher ${teacherId}`);
        }
        const upd = await Course.update({
            name: newName
        }, {
            where: {
                courseId
            }
        })

        return !!upd[0]
    }
}

module.exports = new CourseService();
