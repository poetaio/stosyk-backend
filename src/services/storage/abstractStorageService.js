const {generateUuid} = require("../../utils/uuidGenerator");
const {AUDIO_MP3, IMAGE_JPEG} = require("../../utils/enums/contentType.enum");

module.exports = class AbstractStorageService {

    async uploadFile(file, keyName, contentType) {
        return new Promise();
    }

    async uploadFileDependingOnContentType(file, contentType) {
        if (contentType.toLowerCase().includes("audio")) {
            return await this.uploadAudio(file);
        } else if (contentType.toLowerCase().includes("image")) {
            return await this.uploadImage(file);
        } else {
            return new Error("Problem with content type during saving")
        }
    }

    async uploadAudio(file) {
        return await this.uploadFile(file, "audio/" + generateUuid(), AUDIO_MP3)
    }

    async uploadImage(file) {
        return await this.uploadFile(file, "images/" + generateUuid(), IMAGE_JPEG)
    }
}