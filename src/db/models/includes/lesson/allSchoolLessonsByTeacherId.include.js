// all lessons which belong to any student_seat of this teacher
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
