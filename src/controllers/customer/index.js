const CustomerService = require("../../services/customer");
const { isEmailAlreadyUsed } = require("../../utils/common");
const { handleError, handleResponse } = require("../../utils/responses");

exports.getAll = async (req, res) => {
  const company_id = req.company_id;
  CustomerService.findAll({ company_id: company_id })
    .then((customers) => {
      handleResponse(res, 200, "All Customers", customers);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getCustomer = async (req, res) => {
  const { id } = req.params;
  CustomerService.findBy({ _id: id })
    .then((customer) => {
      handleResponse(res, 200, "Success", customer);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.saveCustomer = async (req, res) => {
  const data = req.body;
  try {
    const check = await isEmailAlreadyUsed(data?.email);
    if (check) {
      throw new Error("Email already exist in system.Please try with new one.");
    }
    const customer = await CustomerService.create(data);
    handleResponse(res, 200, "Customer created successfully", customer);
  } catch (err) {
    handleError(res, err);
  }
};
