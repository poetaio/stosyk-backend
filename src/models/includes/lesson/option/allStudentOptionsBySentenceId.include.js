module.exports = (sentenceId) => ({
    association: "option",
    include: {
        association: "gap",
        include: {
            association: "sentence",
            where: { sentenceId },
            required: true,
        },
        required: true
    },
    required: true
});
