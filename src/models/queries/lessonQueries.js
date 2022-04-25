const DELETE_BY_TEACHER_ID = `
    DELETE FROM lessons
    USING "lessonTeachers"
    WHERE lessons."lessonId" = "lessonTeachers"."lessonId" AND "lessonTeachers"."teacherId" = :teacherId
`;

module.exports = {
    DELETE_BY_TEACHER_ID
};
