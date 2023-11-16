const Mailgun = require("mailgun.js");
const formData = require("form-data");
const API_KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;
const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: "api", key: API_KEY });
class MailgunService {
  static sendEmail(to, subject, text) {
    const messageData = {
      from: `Your App <mailgun@${DOMAIN}>`,
      to: to,
      subject: subject,
      text: text,
    };
    return client.messages.create(DOMAIN, messageData);
  }
}

module.exports = MailgunService;
