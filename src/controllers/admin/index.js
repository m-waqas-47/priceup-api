const AdminService = require("../../services/admin");
const { handleError, handleResponse } = require("../../utils/responses");

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
      const token = await admin.generateJwt("");
      handleResponse(res, 200, "You are successfully logged in!", { token });
    }
  } catch (err) {
    handleError(res, err);
  }
};

exports.saveAdmin = async (req, res) => {
  const password = /*generateRandomString(8)*/ "abcdef";
  const data = { ...req.body, password: password };
  AdminService.create(data)
    .then((admin) => {
      handleResponse(res, 200, "Admin created successfully", admin);
    })
    .catch((err) => {
      handleError(res, err);
    });
};
