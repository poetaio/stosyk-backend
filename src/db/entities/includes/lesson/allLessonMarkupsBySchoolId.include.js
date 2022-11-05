module.exports = (schoolId) => ({
    association: 'school',
    attributes: [],
    where: { schoolId },
    required: true
});
