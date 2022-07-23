module.exports = (homeworkId, types, studentId) => ([
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
        association: "gaps",
        required: true,
        attributes: [],
        include: {
            association: "options",
            required: true,
            attributes: [],
            include: {
                association: "students",
                required: true,
                attributes: [],
                where: {studentId},
            }
        }
    }
]);
