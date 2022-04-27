const DELETE_OPTIONS_BY_GAP_ID = `
    DELETE FROM options
    USING "gapOptions"
    WHERE options."optionId" = "gapOptions"."optionId" AND "gapOptions"."gapId" = :gapId
    RETURNING options."optionId"
`;

module.exports = {
    DELETE_OPTIONS_BY_GAP_ID
};
