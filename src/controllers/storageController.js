const storageService = require("../services/storage/AWSStorageService")

class StorageController {

    async uploadFileAndGetLink(req, res) {
        try {
            const file = req.file;
            return res.status(200).send(await storageService.uploadFileDependingOnMimetype(file, file.mimetype));
        } catch (e) {
            return res.status(404).send("Error during saving: " + e.message);
        }

    }
}

module.exports = new StorageController();

