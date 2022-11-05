const SchoolTeacher = require("../../../relations/SchoolTeacher.entity");
const {SchoolTeacherAccessEnum} = require("../../../../../utils");

module.exports = (schoolId) => ({
    association: 'schoolTeachers',
    where: {
        schoolId,
        accessRight: SchoolTeacherAccessEnum.ADMIN,
    },
});
