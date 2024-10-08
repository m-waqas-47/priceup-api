const { multerActions, multerSource } = require("../../config/common");
const CompanyService = require("../../services/company");
const StaffService = require("../../services/staff");
const UserService = require("../../services/user");
const {
  isEmailAlreadyUsed,
  generateRandomString,
} = require("../../utils/common");
const { addOrUpdateOrDelete } = require("../../services/multer");
const { handleError, handleResponse } = require("../../utils/responses");
const MailgunService = require("../../services/mailgun");
const {
  userCreatedTemplate,
  passwordUpdatedTemplate,
  userNotActiveTemplate,
} = require("../../templates/email");
// const EstimateService = require("../../services/estimate");
// const CustomerService = require("../../services/customer");
// const LayoutService = require("../../services/layout");
const { default: mongoose } = require("mongoose");

exports.getAll = async (req, res) => {
  const company_id = req.user.company_id;
  try {
    const { page = 1, limit = 10, search = "", status, date } = req.query; // Added search query
    // get staff related to company and company he/she have added to
    const query = {
      $or: [
        { company_id: new mongoose.Types.ObjectId(company_id) },
        { haveAccessTo: { $in: [new mongoose.Types.ObjectId(company_id)] } },
      ],
    };
    if (status && ["active", "inactive"].includes(status)) {
      query.status = status === "active" ? true : false;
    }
    if (date) {
      const inputDate = new Date(date);
      const startOfDay = new Date(inputDate.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(inputDate.setUTCHours(23, 59, 59, 999));
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }
    const skip = (page - 1) * limit;
    const data = await StaffService.findAll(query, search, {
      skip,
      limit: Number(limit),
    });
    handleResponse(res, 200, "All Records", data);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getAllStaff = async (req, res) => {
  try {
    const staffs = await StaffService.findAll(); // get all staff
    const staffsWithUserInfo = await Promise.all(
      staffs.map(async (staff) => {
        const company = await CompanyService.findBy({ _id: staff.company_id });
        const user_id = company.user_id;
        const user = await UserService.findBy({ _id: user_id });
        const user_name = user.name;

        return { ...staff.toObject(), user_id, user_name };
      })
    );

    handleResponse(res, 200, "All Staff", staffsWithUserInfo);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getStaff = async (req, res) => {
  const { id } = req.params;
  StaffService.findBy({ _id: id })
    .then((staff) => {
      handleResponse(res, 200, "Success", staff);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  try {
    const oldStaff = await StaffService.findBy({ _id: id });
    if (!oldStaff) {
      throw new Error("Invalid staff ID");
    }

    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.STAFFS,
        req.file.filename,
        oldStaff.image
      );
    }

    if (data?.status !== undefined) {
      const html = userNotActiveTemplate(
        `"${oldStaff.name}" is ${
          data?.status ? "Active" : "Disabled"
        } now.You ${data?.status ? "can" : "can not"} able to login now`
      );
      await MailgunService.sendEmail(
        oldStaff.email,
        `Account ${data?.status ? "Active" : "Disabled"}`,
        html
      );
    }
    const staff = await StaffService.update({ _id: id }, data);
    handleResponse(res, 200, "Staff info updated successfully", staff);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateStaffPassword = async (req, res) => {
  const { id } = req.params;
  const password = generateRandomString(8);
  try {
    const oldStaff = await StaffService.findBy({ _id: id });
    if (!oldStaff) {
      throw new Error("Invalid staff ID");
    }
    const staff = await StaffService.update(
      { _id: id },
      { password: password }
    );
    // Sending an email to the user
    const html = passwordUpdatedTemplate(password);
    await MailgunService.sendEmail(staff.email, "Password Updated", html);
    handleResponse(res, 200, "Staff Password updated successfully", staff);
  } catch (err) {
    handleError(res, err);
  }
};
exports.deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await StaffService.delete({ _id: id });
    if (
      staff &&
      staff.image &&
      staff.image.startsWith("images/staff/uploads")
    ) {
      await addOrUpdateOrDelete(
        multerActions.DELETE,
        multerSource.STAFFS,
        staff.image
      );
    }
    handleResponse(res, 200, "Staff deleted successfully", staff);
  } catch (err) {
    handleError(res, err);
  }
};

exports.saveStaff = async (req, res) => {
  const password = generateRandomString(8);
  const company_id = req.user.company_id;
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: password,
    company_id: company_id,
    haveAccessTo: [company_id],
  };
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
      throw new Error(
        "Email already exist in system. Please try with new one."
      );
    }
    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.SAVE,
        multerSource.STAFFS,
        req.file.path
      );
    }
    const staff = await StaffService.create(data);
    // Sending an email to the user
    const html = userCreatedTemplate(password);
    await MailgunService.sendEmail(data.email, "Account Created", html);
    handleResponse(res, 200, "Staff created successfully", staff);
  } catch (err) {
    handleError(res, err);
  }
};

exports.giveAccessToExisting = async (req, res) => {
  const staffs = await StaffService.findAll();
  try {
    await Promise.all(
      staffs?.map(async (staff) => {
        await StaffService.update(
          { _id: staff._id },
          { haveAccessTo: [staff.company_id] }
        );
      })
    );
    handleResponse(res, 200, "Staffs info updated");
  } catch (err) {
    handleError(res, err);
  }
};

exports.haveAccessTo = async (req, res) => {
  const { id } = req.params;
  const { search = "" } = req.query; // Added search query
  try {
    const resp = await StaffService.findAllLocations(
      { _id: new mongoose.Types.ObjectId(id) },
      { search }
    );
    handleResponse(res, 200, "Locations info", resp);
  } catch (err) {
    handleError(res, err);
  }
};

exports.switchLocation = async (req, res) => {
  const { staffId, companyId } = req.body;
  try {
    const staff = await StaffService.findBy({ _id: staffId });
    if (!staff.haveAccessTo.includes(companyId)) {
      throw new Error("Staff is not authorized to access this location");
    }

    const company = await CompanyService.findBy({ _id: companyId });
    const token = await staff.generateJwt(company._id);
    handleResponse(res, 200, "New Location Access", token);
  } catch (err) {
    handleError(res, err);
  }
};

exports.switchBackToSuperView = async (req, res) => {
  const { userId } = req.body;
  try {
    const staff = await StaffService.findBy({ _id: userId });
    const token = await staff.generateJwt("");
    handleResponse(res, 200, "You are successfully logged in!", { token });
  } catch (err) {
    handleError(res, err);
  }
};
