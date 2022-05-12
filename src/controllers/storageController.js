const storageService = require("../services/storage/AWSStorageService")
const {IMAGE, AUDIO} = require("../utils/enums/attachmentType.enum");

class StorageController {

    async uploadFileAndGetLink(req, res) {
        try {
            const file = req.file;
            let contentType = req.body.contentType;
            if (contentType !== IMAGE && contentType !== AUDIO) {
                contentType = file.mimetype;
            }
            return res.status(200).send(await storageService.uploadFileDependingOnContentType(file, contentType));
        } catch (e) {
            return res.status(404).send("Error during saving: " + e.message);
        }

    }
}

module.exports = new StorageController();

