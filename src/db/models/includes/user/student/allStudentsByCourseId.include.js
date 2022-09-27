module.exports = (courseId) => ({
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
                        association: "lesson",
                        attributes: [],
                        required: true,
                        include: {
                            association: "courses",
                            attributes: [],
                            required: true,
                            where: {courseId},
                        }
                    },
                },
            }
        }
    }
});
