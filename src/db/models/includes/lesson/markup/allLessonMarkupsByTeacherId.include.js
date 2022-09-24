module.exports = (teacherId) =>({
    association: "teacher",
    required: true,
    attributes: [],
    where: {
        teacherId,
    },
})