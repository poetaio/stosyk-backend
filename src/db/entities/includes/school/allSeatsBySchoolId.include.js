module.exports = (schoolId) => ({
    association: "school",
    attributes: [],
    required: true,
    where: {schoolId},
});
