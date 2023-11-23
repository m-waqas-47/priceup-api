const CustomUserService = require("../../services/customUser");
const { handleError, handleResponse } = require("../../utils/responses");

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
  CustomUserService.update({ _id: id }, data)
    .then((customUser) => {
      handleResponse(res, 200, "User info updated successfully", customUser);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  CustomUserService.delete({ _id: id })
    .then((customUser) => {
      handleResponse(res, 200, "User deleted successfully", customUser);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.saveUser = async (req, res) => {
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
      handleError(res, 400, "Staff is not authorized to access this location");
    }

    const company = await CompanyService.findBy({ _id: companyId });
    const token = await staff.generateJwt(company._id);
    handleResponse(res, 200, "New Location Access", token);
  } catch (err) {
    handleError(res, err);
  }
};
