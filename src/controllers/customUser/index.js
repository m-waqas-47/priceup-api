const CompanyService = require("../../services/company");
const CustomUserService = require("../../services/customUser");
const UserService = require("../../services/user");
const bcrypt = require("bcryptjs");
const {
  isEmailAlreadyUsed,
  generateRandomString,
  // nestedObjectsToDotNotation,
} = require("../../utils/common");
const { handleError, handleResponse } = require("../../utils/responses");
const {
  multerSource,
  multerActions,
  userRoles,
} = require("../../config/common");
const { addOrUpdateOrDelete } = require("../../services/multer");
const MailgunService = require("../../services/mailgun");
const {
  userCreatedTemplate,
  passwordUpdatedTemplate,
} = require("../../templates/email");
const EstimateService = require("../../services/estimate");
const CustomerService = require("../../services/customer");
const StaffService = require("../../services/staff");
const LayoutService = require("../../services/layout");

exports.getAll = async (req, res) => {
  CustomUserService.findAll()
    .then((customUsers) => {
      handleResponse(res, 200, "All custom users", customUsers);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  CustomUserService.findBy({ _id: id })
    .then((customUser) => {
      handleResponse(res, 200, "Success", customUser);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  try {
    const oldUser = await CustomUserService.findBy({ _id: id });
    if (!oldUser) {
      throw new Error("Invalid user ID");
    }

    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.CUSTOMUSERS,
        req.file.filename,
        oldUser.image
      );
    }
    const user = await CustomUserService.update({ _id: id }, data);
    handleResponse(res, 200, "User info updated successfully", user);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const password = generateRandomString(8);
  try {
    const oldUser = await CustomUserService.findBy({ _id: id });
    if (!oldUser) {
      throw new Error("Invalid user ID");
    }
    const user = await CustomUserService.update(
      { _id: id },
      { password: password }
    );
    // Sending an email to the user
    const html = passwordUpdatedTemplate(password);
    await MailgunService.sendEmail(user.email, "Password Updated", html);
    handleResponse(res, 200, "User Password updated successfully", user);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const CustomUser = await CustomUserService.delete({ _id: id });
    if (
      CustomUser &&
      CustomUser.image &&
      CustomUser.image.startsWith("images/customUsers/uploads")
    ) {
      await addOrUpdateOrDelete(
        multerActions.DELETE,
        multerSource.CUSTOMUSERS,
        CustomUser.image
      );
    }
    handleResponse(res, 200, "CustomUser deleted successfully", CustomUser);
  } catch (err) {
    handleError(res, err);
  }
};

exports.saveUser = async (req, res) => {
  const password = generateRandomString(8);
  const data = { ...req.body, password: password };
  try {
    if (!data?.email) {
      throw new Error("Email is required.");
    }

    // validate email
    const emailVerified = await MailgunService.verifyEmail(data?.email);
    if (emailVerified?.result !== "deliverable") {
      throw new Error("Email is not valid. Please enter a correct one.");
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
        multerSource.CUSTOMUSERS,
        req.file.path
      );
    }

    const user = await CustomUserService.create(data);
    // Sending an email to the user
    const html = userCreatedTemplate(password);
    await MailgunService.sendEmail(data.email, "Account Created", html);
    handleResponse(res, 200, "User created successfully", user);
  } catch (err) {
    handleError(res, err);
  }
};

exports.haveAccessTo = async (req, res) => {
  const { id } = req.params;
  try {
    const customUser = await CustomUserService.findBy({ _id: id });
    if (!customUser) {
      return handleResponse(res, 200, "Locations info", []); // have no access
    }
    let results = [];
    results = await Promise.all(
      customUser?.locationsAccess?.map(async (company_id) => {
        const company = await CompanyService.findBy({ _id: company_id });
        const estimates = await EstimateService.count({
          company_id: company._id,
        });
        const customers = await CustomerService.count({
          company_id: company._id,
        });
        const staffs = await StaffService.count({
          company_id: company._id,
        });
        const layouts = await LayoutService.count({
          company_id: company._id,
        });
        const user = await UserService.findBy({ _id: company.user_id });
        return {
          company: company,
          user: user,
          estimates: estimates || 0,
          customers: customers || 0,
          staffs: staffs || 0,
          layouts: layouts || 0,
        };
      })
    );
    handleResponse(res, 200, "Locations info", results);
  } catch (err) {
    handleError(res, err);
  }
};

exports.switchBackToSuperView = async (req, res) => {
  const { userId } = req.body;
  try {
    const customAdmin = await CustomUserService.findBy({ _id: userId });
    const token = await customAdmin.generateJwt("");
    handleResponse(res, 200, "You are successfully logged in!", { token });
  } catch (err) {
    handleError(res, err);
  }
};

exports.switchLocation = async (req, res) => {
  const { userId, companyId } = req.body;
  try {
    const customUser = await CustomUserService.findBy({ _id: userId });
    if (!customUser) {
      throw new Error("Invalid user ID");
    }
    const company = await CompanyService.findBy({ _id: companyId });
    if (!company) {
      throw new Error("Invalid company ID");
    }
    if (!customUser.locationsAccess.includes(companyId)) {
      throw new Error("User is not authorized to access this location");
    }
    // if (
    //   !customUser.locationsAccess.find((item) =>
    //     item.company_id.equals(companyId)
    //   )
    // ) {
    //   throw new Error("User is not authorized to access this location");
    // }
    const token = await customUser.generateJwt(company._id);
    handleResponse(res, 200, "New Location Accessed", token);
  } catch (err) {
    handleError(res, err);
  }
};
// exports.generateAccessArray = async (accessArray, user) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let array = [];
//       array = await Promise.all(
//         accessArray?.map(async (item) => {
//           const alreadyExist = user.locationsAccess.find((locationItem) =>
//             locationItem.company_id.equals(item.company_id)
//           );
//           if (alreadyExist) {
//             return item;
//           } else {
//             return {
//               ...item,
//               company_password: await bcrypt.hash(item.company_password, 10),
//             };
//           }
//         })
//       );
//       resolve(array);
//     } catch (err) {
//       reject(err);
//     }
//   });
// };
// exports.UpdateExistingAdmin = async (req, res) => {
//   const user = await CustomUserService.findAll();

//   try {
//     await Promise.all(
//       user?.map(async (users) => {
//         await CustomUserService.update({ _id: users._id }, { password: "abcdef" });
//       })
//     );
//     handleResponse(res, 200, "Custom User info updated");
//   } catch (err) {
//     handleError(res, err);
//   }
// };

exports.giveAccessToExisting = async (req, res) => {
  const customUsers = await CustomUserService.findAll();
  try {
    await Promise.all(
      customUsers?.map(async (customUser) => {
        await CustomUserService.update(
          { _id: customUser._id },
          {
            locationsAccess: [],
            password: "abcdef",
            role: userRoles.CUSTOM_ADMIN,
          }
        );
      })
    );
    handleResponse(res, 200, "Custom Users info updated");
  } catch (err) {
    handleError(res, err);
  }
};
