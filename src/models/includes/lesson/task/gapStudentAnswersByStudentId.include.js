module.exports = (studentId) => ({
    association: "options",
    include: {
        association: "students",
        where: { studentId },
        required: true,
    },
    required: true,
});
