const DELETE_SENTENCES_BY_TASK_ID = `
    DELETE FROM sentences
    USING "taskSentences"
    WHERE sentences."sentenceId" = "taskSentences"."sentenceId" AND "taskSentences"."taskId" = :taskId
    RETURNING sentences."sentenceId"
`;

module.exports = {
    DELETE_SENTENCES_BY_TASK_ID
};
