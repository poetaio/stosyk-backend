module.exports = (homeworkId) => ({
    association: "homeworks",
    required: true,
    attributes: [],
    where: {homeworkId},
});
