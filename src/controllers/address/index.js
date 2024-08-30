const AddressService = require("@services/address");
const { handleError, handleResponse } = require("@utils/responses");
const { default: mongoose } = require("mongoose");
const Service = AddressService;
exports.getAll = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const records = await Service.findAll({ company_id });
    handleResponse(res, 200, "All Records", records);
  } catch (err) {
    handleError(res, err);
  }
};

exports.addressesbyCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const { page, limit, search = "" } = req.query;
    let skip = undefined;
    if (page && limit) {
      skip = (page - 1) * limit;
    }
    const query = {
      customer_id: new mongoose.Types.ObjectId(id),
    };
    const result = await Service.findAllWithPipeline(query, search, {
      skip: skip,
      limit: limit ? Number(limit) : undefined,
    });

    handleResponse(res, 200, "All Records", result);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateAddress = async (req, res) => {
  //   const user = req.user;
  const { id } = req.params;
  const data = { ...req.body };
  try {
    const record = await Service.update({ _id: id }, data);
    handleResponse(res, 200, "Record Updated", record);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteAddress = async (req, res) => {
  const { id } = req.params;
  try {
    const record = await Service.findBy({
      _id: id,
    });
    if (!record) {
      throw new Error("Invalid ID");
    }
    const resp = await Service.delete({ _id: id });
    handleResponse(res, 200, "Record Deleted", resp);
  } catch (err) {
    handleError(res, err);
  }
};

exports.saveAddress = async (req, res) => {
  const user = req.user;
  const data = {
    ...req.body,
    company_id: user.company_id,
  };
  try {
    const record = await Service.create(data);
    handleResponse(res, 200, "Record created successfully", record);
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Another address already exists with the same reference.";
    }
    handleError(res, err);
  }
};
