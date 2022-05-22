// module.exports = (sentenceId) => ({
//     association: "gap",
//     attributes: [],
//     required: true,
//     include: {
//         association: "sentence",
//         attributes: [],
//         where: { sentenceId },
//         required: true,
//     },
// });
module.exports = (sentenceId) => ({
    association: "optionGapOption",
    attributes: [],
    required: true,
    include: {
        association: "gapOptionGap",
        attributes: [],
        required: true,
        include: {
            association: "gapSentenceGap",
            attributes: [],
            required: true,
            include: {
                association: "sentenceGapSentence",
                attributes: [],
                where: { sentenceId },
                required: true,
            },
        },
    },
});
