const CustomerService = require("@services/customer");
const MailgunService = require("@services/mailgun");
const { invoicePreviewTemplate } = require("@templates/email");
const { handleError, handleResponse } = require("@utils/responses");
const { default: mongoose } = require("mongoose");
const LandingPagePreviewService = require("@services/landingPagePreview");

exports.getLandingPagePreview = async (req, res) => {
  const { id } = req.params;
  try {
    const invoicePreviewRecord = await LandingPagePreviewService.findBy({
      project_id: id,
    });
    if (!invoicePreviewRecord) {
      return handleResponse(res, 200, "No preview found", null);
    }
    return handleResponse(res, 200, "Success", invoicePreviewRecord);
  } catch (err) {
    handleError(res, err);
  }
};

exports.createLandingPagePreview = async (req, res) => {
  const data = { ...req.body };
  try {
    const findReq = await LandingPagePreviewService.findBy({
      project_id: data.project_id,
      company_id: data.company_id,
    });
    if (findReq) {
      await LandingPagePreviewService.delete({ _id: findReq._id });
    }
    const resp = await LandingPagePreviewService.create({ ...data });
    const customer = await CustomerService.findBy({
      _id: new mongoose.Types.ObjectId(data?.customer_id),
    });
    if (customer) {
      const html = invoicePreviewTemplate(resp._id);
      await MailgunService.sendEmail(
        customer.email,
        "Invoice preview link",
        html
      );
    }
    handleResponse(res, 200, "Invoice preview generated", resp);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateLandingPagePreview = (req, res) => {
  const data = { ...req.body };
  const { id } = req.params;
  try {
    handleResponse(res, 200, "Success", data);
  } catch (err) {
    handleError(res, err);
  }
};
