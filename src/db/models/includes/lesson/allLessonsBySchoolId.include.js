module.exports = (schoolId) => ({
    association: 'lessonMarkup',
    attributes: [],
    required: true,
    include: {
        association: 'school',
        attributes: [],
        where: {schoolId},
        required: true
    }
});
