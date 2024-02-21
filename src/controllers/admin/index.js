const AdminService = require("../../services/admin");
const UserService = require("../../services/user");
const { handleError, handleResponse } = require("../../utils/responses");
const CompanyService = require("../../services/company");
const { isEmailAlreadyUsed } = require("../../utils/common");
const MailgunService = require("../../services/mailgun");

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
      throw new Error("Incorrect Email address");
    } else if (!admin.comparePassword(password)) {
      throw new Error("Incorrect Credentials");
    } else if (admin.comparePassword(password) && !admin.status) {
      throw new Error("User is not active");
    } else {
      // const company = await CompanyService.findBy({ user_id: admin._id });
      const token = await admin.generateJwt("");
      handleResponse(res, 200, "You are successfully logged in!", { token });
    }
  } catch (err) {
    handleError(res, err);
  }
};

exports.loginAdminById = async (req, res) => {
  const { id } = req.body;
  try {
    const admin = await UserService.findBy({ _id: id });
    const company = await CompanyService.findBy({ user_id: admin._id });
    const token = await admin.generateJwt(company._id);
    handleResponse(res, 200, "You are successfully logged in!", { token });
  } catch (err) {
    handleError(res, err);
  }
};
exports.loginAdminByIdAgain = async (req, res) => {
  const { id } = req.body;
  try {
    const admin = await UserService.findBy({ _id: id });
    const company = await CompanyService.findBy({ user_id: admin._id });
    const token = await admin.generateJwt(company._id);
    handleResponse(res, 200, "You are successfully logged in!", { token });
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  try {
    // const oldUser = await UserService.findBy({ _id: id });

    // if (req.file && req.file.fieldname === "image") {
    //   data.image = await addOrUpdateOrDelete(
    //     multerActions.PUT,
    //     multerSource.USERS,
    //     req.file.filename,
    //     oldUser.image
    //   );
    // }

    const admin = await AdminService.update({ _id: id }, data);
    handleResponse(res, 200, "Super Admin info updated successfully", admin);
  } catch (err) {
    handleError(res, err);
  }
};

exports.saveAdmin = async (req, res) => {
  const password = /*generateRandomString(8)*/ "abcdef";
  const data = { ...req.body, password: password };
  
  try {
    if (!data?.email) {
      throw new Error("Email is required.");
    }

     // validate email
    const emailVerified = await MailgunService.verifyEmail(data?.email);
    if(emailVerified?.result !== 'deliverable'){
     throw new Error("Email is not valid.Please enter a correct one.")
    }

    const check = await isEmailAlreadyUsed(data?.email);
    if (check) {
      throw new Error("Email already exist in system.Please try with new one.");
    }
    const admin = await AdminService.create(data);
    handleResponse(res, 200, "Admin created successfully", admin);
  } catch (err) {
    handleError(res, err);
  }
};
exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await AdminService.findBy({ _id: id });
    if (!admin) {
      throw new Error("Invalid admin ID");
    }
    // Delete Company user
    await AdminService.delete({ _id: admin._id });

    handleResponse(res, 200, "Admin deleted successfully", admin);
  } catch (err) {
    handleError(res, err);
  }
};

exports.allLocations = async (req, res) => {
  try {
    const companies = await CompanyService.findAll();
    const results = await Promise.all(
      companies?.map(async (company) => {
        const admin = await UserService.findBy({ _id: company.user_id });
        return {
          id: company._id,
          name: admin.name,
          image: admin.image,
          email: admin.email,
        };
      })
    );
    handleResponse(res, 200, "All Locations", results);
  } catch (err) {
    handleError(res, err);
  }
};
