module.exports = (studentId) => ({
    association: "options",
    required: true,
    attributes: [],
    include: {
        association: "students",
        attributes: [],
        required: true,
        where: { studentId },
    },
});
