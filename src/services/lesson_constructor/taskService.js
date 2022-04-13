const {Task} = require('../../models');
const teacherTaskInclude = require('../../models/includes/teacherTaskInclude');
const studentTaskInclude = require('../../models/includes/studentTaskInclude');
const gapService = require('./gapService');
const lessonService = require('./lessonService');
const ApiError = require("../../error/ApiError");


class TaskService {
    async existsById(id) {
        return !!await Task.count({ where: { id } });
    }

    async getOneByIdForTeacher(id) {
        return await Task.findOne({ where: { id }, include: studentTaskInclude });
    }

    async getOneByIdForStudent(id) {
        return await Task.findOne({ where: { id }, include: teacherTaskInclude });
    }

    async createWithValues(lessonId, name, description, text, gaps) {
        // if (!await lessonService.existsById(lessonId))
        //     throw ApiError.badRequest(`No lesson with id ${lessonId}`);
        const newTask = await Task.create({ name, description, text, lessonId });

        // manually adding as need to sync rightOptionId and newly created options ids
        for (let { gapPosition, options, rightOption } of gaps) {
            await gapService.createWithValues(newTask.id, gapPosition, options, rightOption);
        }

        return await Task.findOne({ where: { id: newTask.id }, include: teacherTaskInclude })
    }

    async createWithIds(lessonId, name, description, text, gapsIds) {
        // if (!await lessonService.existsById(lessonId))
        //     throw ApiError.badRequest(`No lesson with id ${lessonId}`);

        for (let gapId of gapsIds) {
            if (!await gapService.existsById(gapId))
                throw ApiError.badRequest(`No gap with id ${gapId}`)
        }

        const newTask = await Task.create({ lessonId, text });

        // manually adding as need to sync rightOptionId and newly created options ids
        for (let gapId of gapsIds) {
            const gap = await gapService.getOneByIdForTeacher(gapId);
            await gapService.createWithValues(newTask.id, gap);
        }

        return await Task.findOne( { where: { id: newTask.id }, include: teacherTaskInclude});
    }
}

module.exports = new TaskService();
