const DELETE_GAPS_BY_SENTENCE_ID = `
    DELETE FROM gaps
    USING "sentenceGaps"
    WHERE gaps."gapId" = "sentenceGaps"."gapId" AND "sentenceGaps"."sentenceId" = :sentenceId
    RETURNING gaps."gapId"
`;

module.exports = {
    DELETE_GAPS_BY_SENTENCE_ID
};
