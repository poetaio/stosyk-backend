const SchoolTeacher = require("../../../relations/schoolTeacher.model");
const {SchoolTeacherAccessEnum} = require("../../../../../utils");

module.exports = (schoolId) => ({
    association: 'schoolTeachers',
    where: {
        schoolId,
        accessRight: SchoolTeacherAccessEnum.ADMIN,
    },
});
