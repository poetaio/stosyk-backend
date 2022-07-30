// all lessons which belong to any school of this teacher
module.exports = (teacherId) => ({
    association: 'school',
    attributes: [],
    required: true,
    include: {
        association: 'teachers',
        attributes: [],
        required: true,
        where: { teacherId },
    },
});
