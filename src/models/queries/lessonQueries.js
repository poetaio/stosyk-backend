const DELETE_LESSON_BY_TEACHER_ID = `
    DELETE FROM lessons
    USING "lessonTeachers"
    WHERE lessons."lessonId" = "lessonTeachers"."lessonId" AND "lessonTeachers"."teacherId" = :teacherId
    RETURNING lessons."lessonId"
`;

const DELETE_LESSON_BY_ID = `
    DELETE FROM lessons
    WHERE lessons."lessonId" = :lessonId
    RETURNING lessons."lessonId"
`;

module.exports = {
    DELETE_LESSON_BY_TEACHER_ID,
    DELETE_LESSON_BY_ID
};
