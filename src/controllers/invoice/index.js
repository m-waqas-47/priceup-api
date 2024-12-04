const CustomerService = require("@services/customer");
const EstimateService = require("@services/estimate");
const InvoiceService = require("@services/invoice");
const MailgunService = require("@services/mailgun");
const { invoicePreviewTemplate } = require("@templates/email");
const { generateInvoiceId } = require("@utils/common");
const { handleResponse, handleError } = require("@utils/responses");
const { default: mongoose } = require("mongoose");
const Service = InvoiceService;
exports.getAll = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const { page = 1, limit = 10, search = "", status, date } = req.query; // Added search query
    const query = { company_id: new mongoose.Types.ObjectId(company_id) };
    if (status) {
      query.status = status;
    }
    if (date) {
      const inputDate = new Date(date);
      const startOfDay = new Date(inputDate.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(inputDate.setUTCHours(23, 59, 59, 999));
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }
    const skip = (page - 1) * limit;
    const result = await Service.findAll(query, search, {
      skip,
      limit: Number(limit),
    });
    handleResponse(res, 200, "Success", result);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getSingle = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error("Invalid id");
    }
    const result = await Service.findBy({ _id: id });
    handleResponse(res, 200, "Success", result);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getCustomerPreview = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error("Invalid id");
    }
    const result = await Service.findBy({ _id: id });
    handleResponse(res, 200, "Success", result);
  } catch (err) {
    handleError(res, err);
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  try {
    if (!id) {
      throw new Error("Invalid id");
    }
    const result = await Service.update({ _id: id }, data, { new: true });
    if (data?.customerPreview && result?.customer?.email) {
      const html = invoicePreviewTemplate(data?.customerPreview?.link);
      await MailgunService.sendEmail(
        result.customer.email,
        "Invoice preview link",
        html
      );
    }
    handleResponse(res, 200, "Record updated.", result);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteSingle = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error("Invalid id");
    }
    const result = await Service.delete({ _id: id });
    handleResponse(res, 200, "Record deleted.", result);
  } catch (err) {
    handleError(res, err);
  }
};

exports.save = async (req, res) => {
  const data = { ...req.body };
  const user = req.user;
  try {
    const invoiceId = await generateInvoiceId();
    const invoiceExist = await Service.findBy({
      source_id: data?.source_id,
      customer_id: data?.customer_id,
    });
    if (invoiceExist) {
      throw new Error(
        `Invoice already exist with id ${invoiceExist?.invoiceId}`
      );
    }
    const result = await Service.create({
      ...data,
      invoiceId,
      company_id: user.company_id,
    });
    handleResponse(res, 200, "Record created.", result);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getStats = async (req, res) => {
  const user = req.user;
  try {
    const resp = await InvoiceService.stats({
      company_id: new mongoose.Types.ObjectId(user?.company_id),
    });
    handleResponse(res, 200, "Success", resp);
  } catch (err) {
    handleError(res, err);
  }
};

expotrs.updateCustomerPreview = async (req, res) => {
  const data = { ...req.body };
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error("Invalid id");
    }
    let validStatuses = ["Paid", "Voided"];
    if (!validStatuses.includes(data?.status)) {
      throw new Error("Invalid payload provided");
    }
    await Service.update({ _id: id }, { status: data?.status });
    handleResponse(res, 200, "Invoice updated");
  } catch (err) {
    handleError(res, err);
  }
};
