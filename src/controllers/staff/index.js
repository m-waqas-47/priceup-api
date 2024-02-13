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

exports.getAll = async (req, res) => {
  const company_id = req.company_id;
  // get staff related to company and company he/she have added to
  StaffService.findAll({
    $or: [{ company_id: company_id }, { haveAccessTo: { $in: [company_id] } }],
  })
    .then((staffs) => {
      handleResponse(res, 200, "All Staff", staffs);
    })
    .catch((err) => {
      handleError(res, err);
    });
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

exports.loginStaff = async (req, res) => {
  const { email, password } = req.body;
  try {
    const staff = await StaffService.findBy({ email: email });
    if (!staff) {
      throw new Error("Incorrect Email address");
    } else if (!staff.comparePassword(password)) {
      throw new Error("Incorrect Credentials");
    } else if (staff.comparePassword(password) && !staff.status) {
      throw new Error("Staff is not active");
    } else {
      const company = await CompanyService.findBy({ _id: staff.company_id });
      if (!company) {
        throw new Error("No Company reference found!");
      }
      const token = await staff.generateJwt(company._id);
      handleResponse(res, 200, "You are successfully logged in!", { token });
    }
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
    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.STAFFS,
        req.file.filename,
        oldStaff.image
      );
    }
    const staff = await StaffService.update({ _id: id }, data);
    handleResponse(res, 200, "Staff info updated successfully", staff);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateTeamPassword = async (req, res) => {
  const { id } = req.params;
  const password = generateRandomString(8);
  try {
    const oldStaff = await StaffService.findBy({ _id: id });
    if (!oldStaff) {
      throw new Error("Invalid user ID");
    }
    const staff = await StaffService.update({ _id: id }, password);
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
  const password = /*generateRandomString(8)*/ "abcdef";
  const company_id = req.company_id;
  const data = {
    ...req.body,
    password: password,
    company_id: company_id,
    haveAccessTo: JSON.parse(req.body?.haveAccessTo),
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
  const staff = await StaffService.findBy({ _id: id });
  try {
    const results = await Promise.all(
      staff?.haveAccessTo?.map(async (company_id) => {
        const company = await CompanyService.findBy({ _id: company_id });
        const admin = await UserService.findBy({ _id: company.user_id });
        return {
          id: company._id,
          name: admin.name,
          image: admin.image,
          email: admin.email,
        };
      })
    );
    handleResponse(res, 200, "Locations info", results);
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
