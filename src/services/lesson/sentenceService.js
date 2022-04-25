const { Sentence, SentenceGap } = require("../../models");
const gapService = require('./gapService');

class SentenceService {
    async create(index, text, gaps) {
        const sentence = await Sentence.create({ index, text });

        for (let { position, options } of gaps) {
            const newGap = await gapService.create(position, options);

            await SentenceGap.create({ gapId: newGap.gapId, sentenceId: sentence.sentenceId });
        }

        return sentence;
    }
}

module.exports = new SentenceService();
