const CompanyService = require("../../services/company");
const CustomUserService = require("../../services/customUser");
const UserService = require("../../services/user");
const bcrypt = require("bcryptjs");
const {
  isEmailAlreadyUsed,
  // nestedObjectsToDotNotation,
} = require("../../utils/common");
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
  let data = { ...req.body };
  if (data?.locationsAccess) {
    const user = await CustomUserService.findBy({ _id: id });
    const resultArray = await this.generateAccessArray(
      data.locationsAccess,
      user
    );
    data = { ...data, locationsAccess: resultArray };
  }
  // const updatedData = nestedObjectsToDotNotation(data);
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
  const data = { ...req.body };
  try {
    const check = await isEmailAlreadyUsed(data?.email);
    if (check) {
      throw new Error("Email already exist in system.Please try with new one.");
    }
    const user = await CustomUserService.create(data);
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
      handleResponse(res, 200, "Locations info", []); // have no access
    }
    let results = [];
    results = await Promise.all(
      customUser?.locationsAccess?.map(async (item) => {
        const company = await CompanyService.findBy({ _id: item.company_id });
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
    if (
      !customUser.locationsAccess.find((item) =>
        item.company_id.equals(companyId)
      )
    ) {
      throw new Error("User is not authorized to access this location");
    }
    const token = await customUser.generateJwt(company._id);
    handleResponse(res, 200, "New Location Accessed", token);
  } catch (err) {
    handleError(res, err);
  }
};
exports.generateAccessArray = async (accessArray, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      let array = [];
      array = await Promise.all(
        accessArray?.map(async (item) => {
          const alreadyExist = user.locationsAccess.find((locationItem) =>
            locationItem.company_id.equals(item.company_id)
          );
          if (alreadyExist) {
            return item;
          } else {
            return {
              ...item,
              company_password: await bcrypt.hash(item.company_password, 10),
            };
          }
        })
      );
      resolve(array);
    } catch (err) {
      reject(err);
    }
  });
};
