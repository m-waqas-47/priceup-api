const Mailgun = require("mailgun.js");
const formData = require("form-data");
const API_KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;
const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: "api", key: API_KEY });
class MailgunService {
  static sendEmail(to, subject, html = "<p>Hi</p>", text = "") {
    const messageData = {
      from: `PriceUp <mailgun@${DOMAIN}>`,
      to: to,
      subject: subject,
      html: html,
      text: text,
    };
    try {
      return client.messages.create(DOMAIN, messageData);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
  static verifyEmail(email){
    try{
      return client.validate.get(email,{provider_lookup:true});
    }
    catch (error) {
      console.error("Error verifying email:", error);
    }
  }
}

module.exports = MailgunService;
