module.exports = (sentenceId) => ({
    association: "gap",
    include: {
        association: "sentence",
        where: { sentenceId },
        required: true
    },
    required: true,
});
