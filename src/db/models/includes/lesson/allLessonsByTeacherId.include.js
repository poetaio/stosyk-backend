module.exports = (teacherId) =>({
    association: "lessonMarkup",
    required: true,
    attributes: [],
    include: {
        association: "teacher",
        required: true,
        attributes: [],
        where: {
            teacherId,
        },
    },
})