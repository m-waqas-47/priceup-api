const AdminService = require("../../services/admin");
const UserService = require("../../services/user");
const { handleError, handleResponse } = require("../../utils/responses");
const MailgunService = require('../../services/sendMail/index'); 
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const CompanyService = require('../../services/company')
exports.getAll = async (req, res) => {
  AdminService.findAll()
    .then((admins) => {
      handleResponse(res, 200, "All Records", admins);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await AdminService.findBy({ email: email });
    if (!admin) {
      handleError(res, { statusCode: 400, message: "Incorrect Email address" });
    } else if (!admin.comparePassword(password)) {
      handleError(res, { statusCode: 400, message: "Incorrect Credentials" });
    } else if (admin.comparePassword(password) && !admin.status) {
      handleError(res, { statusCode: 400, message: "User is not active" });
    } else {
      // const company = await CompanyService.findBy({ user_id: admin._id });
      const token = await admin.generateJwt('');
      handleResponse(res, 200, "You are successfully logged in!", { token });
    }
  } catch (err) {
    handleError(res, err);
  }
};

exports.loginAdminById = async (req, res) => {
  const { id } = req.body;
  try {
    const admin = await UserService.findById(id);
    console.log({  id, admin})
    const company = await CompanyService.findBy({ user_id: admin._id });
    const token = await admin.generateJwt(company._id);
      // const token = await admin.generateJwt("");
      handleResponse(res, 200, "You are successfully logged in!", { token });
    
  } catch (err) {
    handleError(res, err);
  }
};

exports.saveAdmin = async (req, res) => {
  const password = /*generateRandomString(8)*/ "abcdef";
  const data = { ...req.body, password: password };

  AdminService.create(data)
    .then((admin) => {

      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({ username: 'api', key: '19495ba7350babfea33a6c84c5edfeed-77316142-233d9fb9',url: 'https://api.mailgun.net' });
      mg.messages.create('sandbox7153a1700fe64377815eb11961d1c1ca.mailgun.org', {
        from: "muhammadwaqas3447@gmail.com",
        to: ["pak993311@gmail.com"],
        subject: "Hello",
        text: "Testing some Mailgun awesomeness!",
        html: "<h1>Testing some Mailgun awesomeness!</h1>"
      })
      .then((msg) => {
        console.log(msg);
        handleResponse(res, 200, "Admin created successfully", admin);
      })
      .catch((err) => {
        console.error(err);
        handleError(res, err);
      });
    })
    .catch((err) => {
      handleError(res, err);
    });
};

// exports.saveAdmin = async (req, res) => {
//   // Your Mailgun configuration
//   const mailgun = new Mailgun(formData);
//   const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere' });

//   // Email data from the request body
//   const emailData = {
//     from: 'Excited User <mailgun@sandbox-123.mailgun.org>',
//     to: ['test@example.com'],
//     subject: 'Hello',
//     text: 'Testing some Mailgun awesomeness!',
//     html: '<h1>Testing some Mailgun awesomeness!</h1>',
//   };

//   // Send the email
//   mg.messages
//     .create('sandbox-123.mailgun.org', emailData)
//     .then((msg) => {
//       console.log(msg); // logs response data
//       res.status(200).json({ message: 'Email sent successfully!' });
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).json({ error: 'Failed to send email.' });
//     });
// }