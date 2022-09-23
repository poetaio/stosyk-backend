module.exports = (schoolStudentSeatId) => ({
    association: 'seats',
    attributes: [],
    required: true,
    where: { schoolStudentSeatId },
});
