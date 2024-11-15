const ContactService = require("@services/contact");
const { handleError, handleResponse } = require("@utils/responses");
const { default: mongoose } = require("mongoose");
const Service = ContactService;
exports.getAll = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const records = await Service.findAll({ company_id });
    handleResponse(res, 200, "All Records", records);
  } catch (err) {
    handleError(res, err);
  }
};

exports.contactsbyCustomer = async (req, res) => {
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

exports.updateRecord = async (req, res) => {
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

exports.deleteRecord = async (req, res) => {
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

exports.saveRecord = async (req, res) => {
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
      err.message = "Another contact already exists with the same phone number.";
    }
    handleError(res, err);
  }
};
