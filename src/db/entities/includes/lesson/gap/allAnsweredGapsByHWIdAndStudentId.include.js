module.exports = (homeworkId, studentId, types) => ([
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
                include: {
                    association: 'homework',
                    attributes: [],
                    required: true,
                    where: {homeworkId}
                }
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
