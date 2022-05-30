const {Lesson, lessonShownTasksInclude} = require("../../models");
const {TaskTypeEnum} = require("../../utils");
const sentenceService = require("./sentenceService");

class LessonAnswersService {
    async getShownAnswers(lessonId) {
        const lesson = await Lesson.findOne({
            where: { lessonId },
            include: lessonShownTasksInclude
        });

        const tasksAnswers = [];

        for (let { taskListTaskTask : task } of lesson.lessonTaskList?.taskListTaskListTasks || []) {
            const newTask = { taskId: task.taskId, sentencesAnswers: [] };
            let taskSentences;
            if (task.type === TaskTypeEnum.MULTIPLE_CHOICE) {
                taskSentences = await sentenceService.getMultipleChoiceSentencesCorrectAnswersByTaskId(task.taskId);
            } else if (task.type === TaskTypeEnum.PLAIN_INPUT) {
                taskSentences = await sentenceService.getPlainInputSentencesByTaskId(task.taskId);
            } else {
                throw new Error(`Unexpected task type: ${task.type}, taskId: ${task.taskId}`);
            }

            for (let { sentenceId, sentenceSentenceGaps } of taskSentences) {
                const newSentence = { sentenceId, gapsAnswers: [] };
                for (let { sentenceGapGap : gap } of sentenceSentenceGaps) {
                    const newGap = { gapId: gap.gapId };
                    newGap.correctAnswers = [];
                    for (let { gapOptionOption : option } of gap.gapGapOptions) {
                        const { optionId, value, optionStudents } = option;
                        // if task type is plain input,
                        // then the correct option is which student didn't choose
                        if (task.type === TaskTypeEnum.PLAIN_INPUT && optionStudents.length) continue;
                        newGap.correctAnswers.push({ optionId, value});
                    }
                    newSentence.gapsAnswers.push(newGap);
                }
                newTask.sentencesAnswers.push(newSentence);
            }
            tasksAnswers.push(newTask);
        }

        return { tasksAnswers };
    }
}

module.exports = new LessonAnswersService();
