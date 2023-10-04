const mailgun = require('mailgun-js');
const apiKey = '62916a6c-e474350e';
const domain = 'sandbox7153a1700fe64377815eb11961d1c1ca.mailgun.org'; 

class MailgunService {
  static sendEmail(to, subject, text, html) {
    const mg = mailgun({ apiKey, domain });

    const data = {
      from: 'pak993322@gmail.com',
      to,
      subject,
      text,
      html,
    };

    return new Promise((resolve, reject) => {
      mg.messages().send(data, (error, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }
}

module.exports = MailgunService;
