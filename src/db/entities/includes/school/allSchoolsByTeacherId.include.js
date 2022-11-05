const {SchoolTeacherAccessEnum} = require("../../../../utils");

module.exports = (teacherId) => ({
    association: 'schoolTeachers',
    required: true,
    attributes: [],
    where: { teacherId, accessRight: SchoolTeacherAccessEnum.ADMIN },
});
