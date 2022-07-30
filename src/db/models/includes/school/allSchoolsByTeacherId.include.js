module.exports = (teacherId) => ({
    association: 'teachers',
    required: true,
    attributes: [],
    where: { teacherId },
});
