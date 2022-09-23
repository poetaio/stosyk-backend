const {emailTransport} = require("../../utils");

class EmailService {
    async sendEmail(emailOptions) {
        await emailTransport.sendMail(emailOptions, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
}

module.exports = new EmailService();
