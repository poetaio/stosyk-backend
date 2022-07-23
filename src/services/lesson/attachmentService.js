const {TaskAttachments} = require("../../models");

class AttachmentService {
    async getAll({taskId}) {
        const where = {};
        if (taskId) {
            where.taskId = taskId;
        }

        return await TaskAttachments.findAll({where});
    }


}

module.exports = new AttachmentService();