const {School, allSchoolsByTeacherIdInclude, SchoolTeacher} = require("../../db/models");
const {SchoolTeacherAccessEnum} = require("../../utils");

class SchoolService {
    async getOneByTeacherId(teacherId) {
        return await School.findOne({
            include: allSchoolsByTeacherIdInclude(teacherId),
        });
    }

    async createWithName(teacherId, name) {
        const school = await School.create({ name });
        await SchoolTeacher.create({
            schoolId: school.schoolId,
            teacherId,
            accessRight: SchoolTeacherAccessEnum.ADMIN,
        })

        return school;
    }

    async create(teacherId) {
        return await this.createWithName(teacherId, "default name");
    }
}

module.exports = new SchoolService();
