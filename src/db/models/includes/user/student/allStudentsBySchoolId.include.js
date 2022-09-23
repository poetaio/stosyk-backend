module.exports = (schoolId) => ({
    association: 'seats',
    required: true,
    attributes: ['status'],
    where: {schoolId},
});
