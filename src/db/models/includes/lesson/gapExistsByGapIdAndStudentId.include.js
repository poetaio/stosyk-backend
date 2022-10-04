const LessonStudent = require("../../relations/lessonStudent.model");

module.exports = (studentId) => ({
    association: 'gapSentenceGap',
    attributes: ["gapId"],
    include: {
        attributes: ["sentenceId"],
        association: 'sentenceGapSentence',
        include: {
            attributes: ["sentenceId"],
            association: 'sentenceTaskSentence',
            include: {
                attributes: ["taskId"],
                association: 'taskSentenceTask',
                include: {
                    attributes: ["taskId"],
                    association: 'taskTaskListTask',
                //     include: {
                //         association: 'taskListTaskTaskList',
                //         include: {
                //             association: 'lesson',
                //             // include: {
                //             //     model: LessonStudent
                //             // }
                //             include: {
                //                 association: 'lessonStudents',
                //                 where: { studentId },
                //                 required: true
                //             },
                //             required: true
                //         },
                //         required: true
                //     },
                    required: true
                },
                required: true
            },
            required: true
        },
        required: true
    },
    required: true
});
