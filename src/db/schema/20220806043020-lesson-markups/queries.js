// todo: check for inner join -> left outer join
// continue with copying everything
// 1. add connection with course
// 2. copy each hw -> taskList
// 3. copy each taskList

// row attribs: teacherId, lessonId, name, description, status, createdAt, updatedAt, taskListId
module.exports.SELECT_ALL_LESSONS_WITH_TASKLISTS_WITH_COURSES = `
    SELECT l."lessonId", l.name, l.description, l.status, l."createdAt" as "lesCreatedAt", l."updatedAt" as "lesUpdatedAt", 
           lc."courseId", lc."createdAt" as "lesCoCreatedAt", lc."updatedAt" as "lesCoUpdatedAt",
           let."teacherId", 
           tal."taskListId", tal."createdAt" as "talCreatedAt", tal."updatedAt" as "talUpdatedAt",
           st."schoolId"
    FROM lessons l
        INNER JOIN "lessonTeachers" let ON let."lessonId" = l."lessonId"
        INNER JOIN "teachers" t ON let."teacherId" = t."teacherId"
        INNER JOIN "schoolTeachers" st ON st."teacherId" = t."teacherId"
        INNER JOIN "taskLists" tal ON tal."lessonId" = l."lessonId"
        LEFT OUTER JOIN "lessonCourses" lc ON lc."lessonId" = l."lessonId"
`;

// row attribs: homeworkId, taskListId
module.exports.SELECT_ALL_HOMEWORKS_WITH_TASKLIST_BY_LESSON_ID = `
    SELECT h."homeworkId", tal."taskListId", h."createdAt" as "hCreatedAt", h."updatedAt" as "hUpdatedAt", tal."createdAt" as "talCreatedAt", tal."updatedAt" as "talUpdatedAt"
    FROM homeworks h
        INNER JOIN "taskLists" tal ON tal."homeworkId" = h."homeworkId"
    where h."lessonId" = ?;
`;

// row attribs: taskId, answersShown, type, description, createdAt, updatedAt
module.exports.SELECT_ALL_TASKS_BY_TASKLIST_ID = `
    SELECT t."taskId", "answersShown", type, description, t."createdAt" as "taCreatedAt", t."updatedAt" as "taUpdatedAt"
    FROM tasks t
        INNER JOIN "taskListTasks" tlt ON tlt."taskId" = t."taskId"
    WHERE "taskListId" = ?
`;

// row attribs: sentenceId, index, text, createdAt, updatedAt
module.exports.SELECT_ALL_SENTENCES_BY_TASK_ID = `
    SELECT *
    FROM sentences s
        INNER JOIN "taskSentences" ts ON ts."sentenceId" = s."sentenceId"
    WHERE "taskId" = ?
`;

// row attribs: gapId, position, createdAt, updatedAt
module.exports.SELECT_ALL_GAP_BY_SENTENCES_ID = `
    SELECT *
    FROM gaps s
        INNER JOIN "sentenceGaps" sg ON sg."gapId" = s."gapId"
    WHERE "sentenceId" = ?
`;

// row attribs: option, value, isCorrect, createdAt, updatedAt
module.exports.SELECT_ALL_OPTIONS_BY_GAP_ID = `
    SELECT *
    FROM options o
        INNER JOIN "gapOptions" go ON o."optionId" = go."optionId"
    WHERE "gapId" = ?
`;

module.exports.INSERT_INTO_LESSON_MARKUP = `
    INSERT INTO "lessonMarkups"("lessonMarkupId", "name", "description", "schoolId", "teacherId", "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?, ?, ?, ?);
`;

module.exports.INSERT_INTO_HOMEWORKS = `
    INSERT INTO "homeworks"("homeworkId", "lessonMarkupId")
    VALUES (?, ?);
`;

module.exports.INSERT_INTO_LESSON_COURSE = `
    INSERT INTO "lessonCourses"("lessonCourseId", "courseId", "lessonId", "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?, ?);
`;

module.exports.INSERT_INTO_TASKLIST_LESSON_MARKUP = `
    INSERT INTO "taskLists"("taskListId", "lessonMarkupId", "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?)
    returning "taskListId";
`;

module.exports.INSERT_INTO_TASKLIST_HOMEWORK = `
    INSERT INTO "taskLists"("taskListId", "homeworkId", "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?);
`;

module.exports.INSERT_INTO_TASKLIST_TASK = `
    INSERT INTO "taskListTasks"("taskListTaskId", "taskListId", "taskId", "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?, ?);
`;

module.exports.INSERT_INTO_TASK = `
    INSERT INTO "tasks"("taskId", "description", "answersShown", "type", "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?, ?, ?);
`;

module.exports.INSERT_INTO_TASK_SENTENCE = `
    INSERT INTO "taskSentences"("taskSentenceId", "taskId", "sentenceId", "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?, ?);
`;

module.exports.INSERT_INTO_SENTENCE = `
    INSERT INTO "sentences"("sentenceId", "index", "text", "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?, ?);
`;

module.exports.INSERT_INTO_SENTENCE_GAP = `
    INSERT INTO "sentenceGaps"("sentenceGapId", "sentenceId", "gapId", "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?, ?);
`;

module.exports.INSERT_INTO_GAP = `
    INSERT INTO "gaps"("gapId", "position", "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?);
`;

module.exports.INSERT_INTO_GAP_OPTION = `
    INSERT INTO "gapOptions"("gapOptionId", "gapId", "optionId", "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?, ?);
`;

module.exports.INSERT_INTO_OPTION = `
    INSERT INTO "options"("optionId", "value", "isCorrect", "createdAt", "updatedAt")
    VALUES (?, ?, ?, ?, ?);
`;

module.exports.UPDATE_LESSON_MARKUP_ID_IN_LESSON = `
    UPDATE lessons
    SET "lessonMarkupId" = ?
    WHERE "lessonId" = ?
`;

module.exports.UPDATE_HOMEWORK_MARKUP_ID_IN_HOMEWORK = `
    UPDATE homeworks
    SET "homeworkMarkupId" = ?
    WHERE "homeworkId" = ?
`;
