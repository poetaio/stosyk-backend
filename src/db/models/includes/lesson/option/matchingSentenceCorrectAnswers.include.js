const Sequelize = require("sequelize");

module.exports = (sentenceId) => ({
    association: "optionGapOption",
    attributes: [],
    include: {
        association: "gapOptionGap",
        attributes: ['position'],
        include: {
            association: "gapSentenceGap",
            attributes: [],
            include: {
                association: "sentenceGapSentence",
                attributes: [],
                where: { sentenceId },
                required: true,
            },
            required: true,
        },
        required: true,
    },
    required: true,
});
