const {attachmentService} = require("../../services");

class AttachmentController {
    async getAttachments(parent, args, context) {
        return await attachmentService.getAll(parent);
    }
}

module.exports = new AttachmentController();