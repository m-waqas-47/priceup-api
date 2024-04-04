const AdminService = require("../../services/admin");
const UserService = require("../../services/user");
const { handleError, handleResponse } = require("../../utils/responses");
const CompanyService = require("../../services/company");
const {
  isEmailAlreadyUsed,
  generateRandomString,
} = require("../../utils/common");
const MailgunService = require("../../services/mailgun");
const { addOrUpdateOrDelete } = require("../../services/multer");
const { multerSource, multerActions } = require("../../config/common");
const {
  passwordUpdatedTemplate,
  userCreatedTemplate,
} = require("../../templates/email");

exports.getAll = async (req, res) => {
  AdminService.findAll()
    .then((admins) => {
      handleResponse(res, 200, "All Records", admins);
    })
    .catch((err) => {
      handleError(res, err);
    });
};


exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  try {
    const oldAdmin = await AdminService.findBy({ _id: id });
    if (!oldAdmin) {
      throw new Error("Invalid admin ID");
    }

    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.ADMINS,
        req.file.filename,
        oldAdmin.image
      );
    }
    const admin = await AdminService.update({ _id: id }, data);
    handleResponse(res, 200, "Super Admin info updated successfully", admin);
  } catch (err) {
    handleError(res, err);
  }
};

exports.saveAdmin = async (req, res) => {
  const password = generateRandomString(8);
  const data = { ...req.body, password: password };

  try {
    if (!data?.email) {
      throw new Error("Email is required.");
    }

    // validate email
    const emailVerified = await MailgunService.verifyEmail(data?.email);
    if (emailVerified?.result !== "deliverable") {
      throw new Error("Email is not valid.Please enter a correct one.");
    }

    const check = await isEmailAlreadyUsed(data?.email);
    if (check) {
      throw new Error("Email already exist in system.Please try with new one.");
    }

    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.SAVE,
        multerSource.ADMINS,
        req.file.path
      );
    }

    const admin = await AdminService.create(data);
    // Sending an email to the user
    const html = userCreatedTemplate(password);
    await MailgunService.sendEmail(data.email, "Account Created", html);
    handleResponse(res, 200, "Admin created successfully", admin);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateAdminPassword = async (req, res) => {
  const { id } = req.params;
  const password = generateRandomString(8);
  try {
    const oldAdmin = await AdminService.findBy({ _id: id });
    if (!oldAdmin) {
      throw new Error("Invalid admin ID");
    }
    const admin = await AdminService.update(
      { _id: id },
      { password: password }
    );
    // Sending an email to the user
    const html = passwordUpdatedTemplate(password);
    await MailgunService.sendEmail(admin.email, "Password Updated", html);
    handleResponse(res, 200, "Admin Password updated successfully", admin);
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
    if (
      admin &&
      admin.image &&
      admin.image.startsWith("images/admins/uploads")
    ) {
      await addOrUpdateOrDelete(
        multerActions.DELETE,
        multerSource.ADMINS,
        admin.image
      );
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
    const admins = await UserService.findAll();
    const results = await Promise.all(
      companies?.map(async (company) => {
        const admin = admins.find(item => item.id === company.user_id.toString());
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

exports.switchLocation = async (req, res) => {
  const { userId, companyId } = req.body;
  try {
    const user = await UserService.findBy({ _id: userId });

    if (!user) {
      throw new Error("Invalid user ID");
    }
    const userCompany = await CompanyService.findBy({ _id: companyId });
    if (!userCompany) {
      throw new Error("Invalid company ID");
    }

    const token = await user.generateJwt(userCompany._id);
    handleResponse(res, 200, "New Location Accessed", token);
  } catch (err) {
    handleError(res, err);
  }
};

exports.switchBackToSuperView = async (req, res) => {
  const { userId } = req.body;
  try {
    const admin = await AdminService.findBy({ _id: userId });
    if (!admin) {
      throw new Error("Invalid user ID");
    }
    const token = await admin.generateJwt("");
    handleResponse(res, 200, "You are successfully logged out!", { token });
  } catch (err) {
    handleError(res, err);
  }
};
