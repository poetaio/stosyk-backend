module.exports = (lessonId, studentId, types) => ([
    {
        association: 'sentence',
        attributes: [],
        required: true,
        include: {
            association: 'task',
            attributes: [],
            where: { type: types },
            required: true,
            include: {
                association: 'taskList',
                attributes: [],
                required: true,
                where: {lessonId},
            }
        }
    },
    {
        association: "options",
        required: true,
        attributes: [],
        include: {
            association: "students",
            required: true,
            attributes: [],
            where: { studentId },
        }
    }
]);
