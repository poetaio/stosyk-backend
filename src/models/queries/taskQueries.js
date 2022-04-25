const DELETE_TASK_BY_LESSON_ID = `
    DELETE FROM tasks
    USING "taskLists", "taskListTasks"
    WHERE tasks."taskId" = "taskListTasks"."taskId" AND "taskLists"."taskListId" = "taskListTasks"."taskListId" AND "taskLists"."lessonId" = :lessonId
    RETURNING tasks."taskId"
`;

module.exports = {
    DELETE_TASK_BY_LESSON_ID
};
