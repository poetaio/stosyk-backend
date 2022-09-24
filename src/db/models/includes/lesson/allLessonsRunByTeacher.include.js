module.exports = (teacherId) => ({
    association: "teacher",
    attributes: [],
    required: true,
    where: {teacherId},
});
