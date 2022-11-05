module.exports = (schoolId) => ({
    association: 'schoolStudents',
    required: true,
    attributes: [],
    where: {schoolId},
});
