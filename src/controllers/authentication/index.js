const AdminService = require("../../services/admin");
const CompanyService = require("../../services/company");
const CustomUserService = require("../../services/customUser");
const StaffService = require("../../services/staff");
const UserService = require("../../services/user");
const { handleError, handleResponse } = require("../../utils/responses");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await AdminService.findBy({ email: email });
    if (admin) {
      // super admin login
      if (!admin.comparePassword(password)) {
        throw new Error("Incorrect Credentials");
      } else if (admin.comparePassword(password) && !admin.status) {
        throw new Error("User is not active");
      }
      const token = await admin.generateJwt("");
      handleResponse(res, 200, "You are successfully logged in!", { token });
    }
    const user = await UserService.findBy({ email: email });
    if (user) {
      // simple admin login
      if (!user.comparePassword(password)) {
        throw new Error("Incorrect Credentials");
      }
      if (user.comparePassword(password) && !user.status) {
        throw new Error("User is not active");
      }
      const company = await CompanyService.findBy({ user_id: user._id });
      const token = await user.generateJwt(company._id);
      handleResponse(res, 200, "You are successfully logged in!", { token });
    }
    const customUser = await CustomUserService.findBy({ email: email });
    if (customUser) {
      // custom admin login
      if (!customUser.comparePassword(password)) {
        throw new Error("Incorrect Credentials");
      }
      if (customUser.comparePassword(password) && !customUser.status) {
        throw new Error("User is not active");
      }
      // const company = await CompanyService.findBy({ user_id: user._id });
      const token = await customUser.generateJwt("");
      handleResponse(res, 200, "You are successfully logged in!", { token });
    }
    const staff = await StaffService.findBy({ email: email });
    if (staff) {
      // staff login
      if (!staff.comparePassword(password)) {
        throw new Error("Incorrect Credentials");
      }
      if (staff.comparePassword(password) && !staff.status) {
        throw new Error("User is not active");
      }
      const company = await CompanyService.findBy({ _id: staff.company_id });
      const token = await staff.generateJwt(company._id);
      handleResponse(res, 200, "You are successfully logged in!", { token });
    }
    if (!user && !customUser && !admin && !staff) {
      throw new Error("Incorrect Email address");
    }
  } catch (err) {
    handleError(res, err);
  }
};
