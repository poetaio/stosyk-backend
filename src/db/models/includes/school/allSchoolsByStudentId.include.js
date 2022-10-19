module.exports = (studentId) => ({
    association: 'seats',
    required: true,
    attributes: [],
    where: { studentId },
});
