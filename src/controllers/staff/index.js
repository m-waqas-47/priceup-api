const CompanyService = require("../../services/company");
const StaffService = require("../../services/staff");
const UserService = require("../../services/user");
const { handleError, handleResponse } = require("../../utils/responses");

exports.getAll = async (req, res) => {
  const company_id = req.company_id;
  StaffService.findAll({ company_id: company_id })
    .then((staffs) => {
      handleResponse(res, 200, "All Staff", staffs);
    })
    .catch((err) => {
      handleError(res, err);
    });
};
exports.getAllStaff = async (req, res) => {
  try {
    const staffs = await StaffService.findAll();
    const staffsWithUserInfo = await Promise.all(staffs.map(async (staff) => {
      const company = await CompanyService.findById(staff.company_id);
      const user_id = company.user_id;
      const user = await UserService.findById(user_id);
      const user_name = user.name;

      return { ...staff.toObject(), user_id, user_name };
    }));

    res.status(200).json({ message: 'All Staff', data: staffsWithUserInfo });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching staff', error: err.message });
  }
};



exports.loginStaff = async (req, res) => {
  const { email, password } = req.body;
  try {
    const staff = await StaffService.findBy({ email: email });
    if (!staff) {
      handleError(res, { statusCode: 400, message: "Incorrect Email address" });
    } else if (!staff.comparePassword(password)) {
      handleError(res, { statusCode: 400, message: "Incorrect Credentials" });
    } else if (staff.comparePassword(password) && !staff.status) {
      handleError(res, { statusCode: 400, message: "Staff is not active" });
    } else {
      const company = await CompanyService.findBy({ _id: staff.company_id });
      if (!company) {
        handleError(res, {
          statusCode: 400,
          message: "No Company reference found!",
        });
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
  StaffService.update({ _id: id }, data)
    .then((staff) => {
      handleResponse(res, 200, "Staff info updated successfully", staff);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteStaff = async (req, res) => {
  const { id } = req.params;
  StaffService.delete({ _id: id })
    .then((staff) => {
      handleResponse(res, 200, "Staff deleted successfully", staff);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.saveStaff = async (req, res) => {
  const password = /*generateRandomString(8)*/ "abcdef";
  const data = { ...req.body, password: password };
  StaffService.create(data)
    .then((staff) => {
      handleResponse(res, 200, "Staff created successfully", staff);
    })
    .catch((err) => {
      handleError(res, err);
    });
};



