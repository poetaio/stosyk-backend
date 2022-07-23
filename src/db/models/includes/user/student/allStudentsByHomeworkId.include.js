module.exports = (homeworkId) => ({
    association: "options",
    attributes: [],
    required: true,
    include: {
        association: "gap",
        attributes: [],
        required: true,
        include: {
            association: "sentence",
            attributes: [],
            required: true,
            include: {
                association: "task",
                attributes: [],
                required: true,
                include: {
                    association: "taskList",
                    attributes: [],
                    required: true,
                    include: {
                        association: "homework",
                        attributes: [],
                        required: true,
                        where: {homeworkId},
                    },
                },
            }
        }
    }
});
