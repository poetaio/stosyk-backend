const {Lesson, lessonCorrectAnswersInclude} = require("../../models");

class LessonAnswersService {
    async getShownAnswers(lessonId) {
        const lesson = await Lesson.findOne({
            where: { lessonId },
            include: lessonCorrectAnswersInclude
        });

        const tasksAnswers = [];

        for (let { taskListTaskTask : task } of lesson.lessonTaskList?.taskListTaskListTasks || []) {
            const newTask = { taskId: task.taskId, sentencesAnswers: [] };
            for (let { taskSentenceSentence : sentence } of task.taskTaskSentences) {
                const newSentence = { sentenceId: sentence.sentenceId, gapsAnswers: [] };
                for (let { sentenceGapGap : gap } of sentence.sentenceSentenceGaps) {
                    const newGap = { gapId: gap.gapId };
                    newGap.correctAnswers = [];
                    for (let { gapOptionOption : option } of gap.gapGapOptions) {
                        const { optionId, value } = option;
                        newGap.correctAnswers.push({ optionId, value})
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
