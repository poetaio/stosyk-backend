const {generateUuid} = require("../../utils/uuidGenerator");
const {AUDIO_MP3, IMAGE_JPEG} = require("../../utils/enums/contentType.enum");

module.exports = class AbstractStorageService {

    async uploadFile(filePath, keyName, contentType) {
        return new Promise();
    }

    async uploadFileDependingOnMimetype(file, contentType) {
        if (contentType.includes("audio")) {
            return await this.uploadFile(file, "audio/" + generateUuid(), AUDIO_MP3);
        } else if (contentType.includes("image")) {
            return await this.uploadFile(file, "images/" + generateUuid(), IMAGE_JPEG);
        } else {
            return new Error("Problem with content type during saving")
        }
    }

    async uploadAudio(filePath) {
        return await this.uploadFile(filePath, "audio/" + generateUuid(), AUDIO_MP3)
    }

    async uploadImage(filePath) {
        return await this.uploadFile(filePath, "images/" + generateUuid(), IMAGE_JPEG)
    }
}