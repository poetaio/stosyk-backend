module.exports = (studentId, homeworkId, types) => ([
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
                where: {homeworkId}
            }
        }
    },
    {
        association: "options",
        required: true,
        where: { isCorrect: true },
        attributes: [],
        include: {
            association: "students",
            required: true,
            attributes: [],
            where: { studentId },
        }
    }
]);
