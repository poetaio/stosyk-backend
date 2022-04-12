const { ActiveTask} = require('../../models');
const activeGapService = require('./activeGapService');
const gapService = require("../lesson_constructor/gapService");
const ApiError = require("../../error/ApiError");
const teacherTaskInclude = require("../../models/includes/teacherTaskInclude");


class ActiveTaskService {
    async existsById(taskId) {
        return !!await ActiveTask.count({ where: {id: taskId} });
    }

    async existsByIdAndLessonId(taskId, lessonId) {
        return !!await ActiveTask.count({ where: { id: taskId, lessonId } });
    }

    async createEmpty(lessonId, name, description, text) {
        return await ActiveTask.create({ lessonId, name, description, text });
    }

    // gaps contains options as [ value ], rightOption as value
    async createWithGapsValues(activeLessonId, name, description, text, gaps) {
        const newTask = await ActiveTask.create({ activeLessonId, name, description, text });

        // adding each gap manually, as need to sync new options and
        for (let { gapPosition, options, rightOption } of gaps) {
            await activeGapService.createWithOptionsValues(newTask.id, gapPosition, options, rightOption);
        }

        // todo: check if include is needed
        // pass as param (short, or full list of gaps)
        return newTask;
    }

    async createWithGapsIds(lessonId, name, description, text, gapsIds) {
        for (let gapId of gapsIds) {
            if (!await activeGapService.existsById(gapId))
                throw ApiError.badRequest(`No gap with id ${gapId}`)
        }

        const newTask = await ActiveTask.create({ lessonId, text });

        for (let gapId of gapsIds) {
            const gap = await gapService.getOneByIdForTeacher(gapId);
            await gapService.createWithValues(newTask.id, gap);
        }

        return await ActiveTask.findOne( { where: { id: newTask.id }, include: teacherTaskInclude});
    }
}

module.exports = new ActiveTaskService();
