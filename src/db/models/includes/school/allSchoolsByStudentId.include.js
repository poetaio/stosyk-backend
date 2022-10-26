module.exports = (studentId) => ({
    association: 'schoolStudents',
    required: true,
    attributes: [],
    where: { studentId },
});
