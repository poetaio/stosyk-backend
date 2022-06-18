// find all options of provided gaps
module.exports = (gapIds) => ({
    association: "optionGapOption",
    include: {
        association: "gapOptionGap",
        where: { "gapId": gapIds },
        required: true,
    },
    required: true,
});
