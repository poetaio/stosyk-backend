module.exports = (gapId) => ({
    model: "option",
    include: {
        association: "gap",
        where: { gapId },
        required: true
    },
    required: true
});
