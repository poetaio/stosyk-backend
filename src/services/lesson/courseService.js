const {Course, TeacherCourse, LessonCourse, allCoursesByTeacherIdInclude, allLessonCoursesByMarkupIdInclude,
    Student,
    allStudentsByCourseIdInclude
} = require("../../db/models");
const {NotFoundError} = require("../../utils");
const lessonService = require("./lessonService");
const markupService = require('./markupService');

class CourseService {
    async createCourse(name, teacherId, schoolId  ){
        const newCourse = await Course.create({name, schoolId});
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
        return !! await LessonCourse.create({courseId, lessonId: lessonMarkupId})
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

    async getAllStudentsWhoTookLessons(courseId) {
        return await Student.findAll({
            include: allStudentsByCourseIdInclude(courseId),
        });
    }

    // passing func argument to get result to calculate value we need to return for each lesson
    async getStudentResult(courseId, studentId, funcToGetResult) {
        const lessons = await lessonService.getMarkupsByCourse(courseId);

        if (!lessons.length) {
            return null;
        }

        // todo: fix if... forgot... but something requires to be fixed definitely
        const lessonScores = await Promise.all(
            lessons
                .map(({lessonMarkupId}) => funcToGetResult(lessonMarkupId, studentId))
                .filter(result => result !== null)
        );

        const lessonsScoresSum = lessonScores.reduce((sum, next) => sum + next, 0);

        return lessonsScoresSum / lessons.length;
    }

    async getTotalScore(courseId, studentId) {
        return await this.getStudentResult(courseId, studentId, markupService.getStudentTotalScore.bind(markupService));
    }

    async getStudentProgress(courseId, studentId) {
        return await this.getStudentResult(courseId, studentId, markupService.getStudentProgress.bind(markupService));
    }
}

module.exports = new CourseService();
