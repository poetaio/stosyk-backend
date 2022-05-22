module.exports = (studentId) => ({
    association: "option",
    include: {
        association: "students",
        where: { studentId },
        required: true,
    },
    required: true,
});
