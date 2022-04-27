const { Sentence } = require("../../models");
const {sentenceService} = require("../../services");

class SentenceController {
    async getSentences(parent, args, context) {
        return await sentenceService.getAll(parent);
    }
}

module.exports = new SentenceController();
