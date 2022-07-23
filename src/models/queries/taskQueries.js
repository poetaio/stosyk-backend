const DELETE_TASK_BY_LESSON_ID = `
    DELETE FROM tasks
    USING "taskLists", "taskListTasks"
    WHERE tasks."taskId" = "taskListTasks"."taskId" AND "taskLists"."taskListId" = "taskListTasks"."taskListId" AND "taskLists"."lessonId" = :lessonId
    RETURNING tasks."taskId"
`;

const GET_SOMETHING = `
    SELECT *
    FROM gaps g
        NATURAL INNER JOIN "sentenceGaps"
    WHERE g."gapId" = :gapId;
`;

const GET_TASK_TYPE_BY_GAP_ID = `
    SELECT t.type
    FROM gaps g
        INNER JOIN "sentenceGaps" sg 
            ON g."gapId" = sg."gapId"
        INNER JOIN sentences s
            ON sg."sentenceId" = s."sentenceId"
        INNER JOIN "taskSentences" ts
            ON s."sentenceId" = ts."sentenceId"
        INNER JOIN tasks t
            ON  t."taskId" = ts."taskId"
    WHERE g."gapId" = :gapId;
`;

module.exports = {
    DELETE_TASK_BY_LESSON_ID,
    GET_TASK_TYPE_BY_GAP_ID,
    GET_SOMETHING
};
