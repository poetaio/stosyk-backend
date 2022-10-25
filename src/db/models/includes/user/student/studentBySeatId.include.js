module.exports = (schoolStudentId) => ({
    association: 'schoolStudents',
    attributes: [],
    required: true,
    where: { schoolStudentId },
});
