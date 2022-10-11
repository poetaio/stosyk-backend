const {emailTransport, logger} = require("../../utils");

class EmailService {
    async sendEmail(emailOptions) {
        await emailTransport.sendMail(emailOptions, (err) => {
            if (err) {
                logger.error(err);
            }
        });
    }
}

module.exports = new EmailService();
