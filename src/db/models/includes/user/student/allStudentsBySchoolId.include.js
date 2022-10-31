module.exports = (schoolId) => ({
    association: 'seats',
    required: true,
    attributes: [],
    where: {schoolId},
});
