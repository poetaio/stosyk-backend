module.exports = (teacherId) => ({
    association: "lesson",
    required: true,
    attributes: [],
    include: {
        association: "teacher",
        where: {teacherId},
        required: true,
        attributes: [],
    }
});
