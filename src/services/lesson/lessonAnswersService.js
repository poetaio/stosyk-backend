const {Lesson, lessonShownTasksInclude, lessonShownTasksNewInclude} = require("../../db/models");
const {TaskTypeEnum} = require("../../utils");
const sentenceService = require("./sentenceService");

class LessonAnswersService {
    // todo: remove method
    // returns only lesson tasks!
    async getShownAnswers(lessonId) {
        const lesson = await Lesson.findOne({
            where: { lessonId },
            include: lessonShownTasksNewInclude
        });

        return { tasksAnswers: lesson.lessonTaskList?.task || [] };
    }
}

module.exports = new LessonAnswersService();
