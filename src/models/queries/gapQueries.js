const DELETE_GAPS_BY_SENTENCE_ID = `
    DELETE FROM gaps
    USING "sentenceGaps"
    WHERE gaps."gapId" = "sentenceGaps"."gapId" AND "sentenceGaps"."sentenceId" = :sentenceId
    RETURNING gaps."gapId"
`;

const GET_GAP_CORRECT_PLAIN_OPTIONS = `
    SELECT *
    FROM options o
        INNER JOIN "gapOptions" go
            ON o."optionId" = go."optionId"
    -- no student who has chosen this option, thus it's the only one entered by teacher
    WHERE go."gapId" = :gapId AND NOT EXISTS(
        SELECT * 
        FROM "studentOptions" so
        WHERE so."optionId" = o."optionId"
    );
`;

module.exports = {
    DELETE_GAPS_BY_SENTENCE_ID,
    GET_GAP_CORRECT_PLAIN_OPTIONS
};
