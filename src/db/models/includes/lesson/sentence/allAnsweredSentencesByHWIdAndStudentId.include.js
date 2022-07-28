module.exports = (homeworkId, studentId, types) => ([
    {
        association: 'task',
        attributes: [],
        where: { type: types },
        required: true,
        include: {
            association: 'taskList',
            attributes: [],
            required: true,
            include: {
                association: 'homework',
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
