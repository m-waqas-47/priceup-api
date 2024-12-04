const AdminService = require("@services/admin");
const UserService = require("@services/user");
const { handleError, handleResponse } = require("@utils/responses");
const CompanyService = require("@services/company");
const {
  isEmailAlreadyUsed,
  generateRandomString,
  validateEmail,
  checkIfEmailExists,
  getMulterSource,
} = require("@utils/common");
const MailgunService = require("@services/mailgun");
const { addOrUpdateOrDelete } = require("@services/multer");
const { multerSource, multerActions, userRoles } = require("@config/common");
const {
  passwordUpdatedTemplate,
  userCreatedTemplate,
} = require("@templates/email");
const StaffService = require("@services/staff");
const CustomUserService = require("@services/customUser");

exports.getAll = async (req, res) => {
  AdminService.findAll()
    .then((admins) => {
      handleResponse(res, 200, "All Records", admins);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getDashboardStats = async (req,res) => {
  try{
    const topPerforming = await CompanyService.findTopPerformingCompanies();
    const staffCount = await StaffService.count();
    const adminCount = await AdminService.count();
    const customUserCount = await CustomUserService.count();
    handleResponse(res,200,'Success',{...topPerforming,totalUsers: (staffCount ?? 0) + (adminCount ?? 0) + (customUserCount ?? 0)})
  } 
  catch(err){
    handleError(res,err);
  }
}

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

exports.saveUser = async (req, res) => {
  const password = generateRandomString(8);
  const data = { ...req.body, password };
  try {
    if (!data?.email) {
      throw new Error("Email is required");
    }
    if (!data?.role) {
      throw new Error("Role is required");
    }
    await validateEmail(data.email);
    await checkIfEmailExists(data.email);
    const multerSourceVal = getMulterSource(data.role);
    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.SAVE,
        multerSourceVal,
        req.file.path
      );
    }
    const assignedLocations = JSON.parse(data.assignedLocations);
    let user = null;
    switch (data.role) {
      case userRoles.SUPER_ADMIN:
        user = await AdminService.create(data);
        break;
      case userRoles.STAFF:
        user = await StaffService.create({
          ...data,
          company_id: assignedLocations[0],
          haveAccessTo: assignedLocations,
        });
        break;
      case userRoles.CUSTOM_ADMIN:
        user = await CustomUserService.create({
          ...data,
          locationsAccess: assignedLocations,
        });
        break;
      default:
        break;
    }
    // Sending an email to the user
    const html = userCreatedTemplate(password);
    await MailgunService.sendEmail(data.email, "Account Created", html);
    return handleResponse(res, 200, "User created successfully", user);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  try {
    if (!data?.role) {
      throw new Error("Role is required");
    }
    let oldRecord = null;
    switch (data.role) {
      case userRoles.STAFF:
        oldRecord = await StaffService.findBy({ _id: id });
        break;
      case userRoles.CUSTOM_ADMIN:
        oldRecord = await CustomUserService.findBy({ _id: id });
        break;
      case userRoles.SUPER_ADMIN:
        oldRecord = await AdminService.findBy({ _id: id });
        break;
      default:
        break;
    }
    const multerSourceVal = getMulterSource(data.role);
    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSourceVal,
        req.file.path,
        oldRecord?.image
      );
    }
    const assignedLocations = JSON.parse(data.assignedLocations);
    let user = null;
    switch (data.role) {
      case userRoles.SUPER_ADMIN:
        user = await AdminService.update({ _id: id }, data);
        break;
      case userRoles.STAFF:
        user = await StaffService.update(
          { _id: id },
          {
            ...data,
            haveAccessTo: assignedLocations,
          }
        );
        break;
      case userRoles.CUSTOM_ADMIN:
        user = await CustomUserService.update(
          { _id: id },
          {
            ...data,
            locationsAccess: assignedLocations,
          }
        );
        break;
      default:
        break;
    }

    return handleResponse(res, 200, "User created successfully", user);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const role = req.query?.role;
  const password = generateRandomString(8);
  try {
    if (!role) {
      throw new Error("Role is required");
    }
    let user = null;
    switch (role) {
      case userRoles.SUPER_ADMIN:
        user = await AdminService.update({ _id: id }, { password: password });
        break;
      case userRoles.STAFF:
        user = await StaffService.update({ _id: id }, { password: password });
        break;
      case userRoles.CUSTOM_ADMIN:
        user = await CustomUserService.update(
          { _id: id },
          { password: password }
        );
        break;
      default:
        break;
    }
    // Sending an email to the user
    const html = passwordUpdatedTemplate(password);
    await MailgunService.sendEmail(user.email, "Password Updated", html);
    handleResponse(res, 200, "User password updated successfully", user);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await AdminService.delete({ _id: id });
    const staff = await StaffService.delete({ _id: id });
    const customAdmin = await CustomUserService.delete({ _id: id });
    if (admin) {
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
      return handleResponse(res, 200, "User deleted successfully", admin);
    }
    if (staff) {
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
      return handleResponse(res, 200, "User deleted successfully", staff);
    }
    if (customAdmin) {
      if (
        customAdmin &&
        customAdmin.image &&
        customAdmin.image.startsWith("images/customUsers/uploads")
      ) {
        await addOrUpdateOrDelete(
          multerActions.DELETE,
          multerSource.CUSTOMUSERS,
          customAdmin.image
        );
      }
      return handleResponse(res, 200, "User deleted successfully", customAdmin);
    }
    if (!admin && !customAdmin && !staff) {
      throw new Error("Invalid user id");
    }
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
        const admin = admins.find(
          (item) => item.id === company.user_id.toString()
        );
        return {
          id: company._id,
          name: company.name,
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

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status, date, role } = req.query; // Added search query
    const query = {};
    if (status && ['active','inactive'].includes(status)) {
      query.status = status === 'active' ? true : false;
    }
    if (role) {
      query.role = role;
    }
    if (date) {
      const inputDate = new Date(date);
      const startOfDay = new Date(inputDate.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(inputDate.setUTCHours(23, 59, 59, 999));
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }
    const skip = (page - 1) * limit;
    const data = await AdminService.findAllUsers(query, search, {
      skip,
      limit: Number(limit),
    });
    handleResponse(res, 200, "All Records", { ...data });
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
