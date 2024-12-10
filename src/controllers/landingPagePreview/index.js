const CustomerService = require("@services/customer");
const MailgunService = require("@services/mailgun");
const { landingPagePreview } = require("@templates/email");
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
  const user = req.user;
  try {
    const findReq = await LandingPagePreviewService.findBy({
      project_id: data.project_id,
      company_id: user.company_id,
    });
    if (findReq) {
      await LandingPagePreviewService.delete({ _id: findReq._id });
    }
    const resp = await LandingPagePreviewService.create({
      ...data,
      company_id: user.company_id,
    });
    handleResponse(res, 200, "Invoice preview generated", resp);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateLandingPagePreview = async (req, res) => {
  const data = { ...req.body };
  const { id } = req.params;
  try {
    const resp = await LandingPagePreviewService.update(
      { project_id: id },
      data
    );
    if (resp && resp?.customer_id) {
      const customer = await CustomerService.findBy({
        _id: new mongoose.Types.ObjectId(resp?.customer_id),
      });
      if (customer) {
        const html = landingPagePreview(resp.customerPreview?.link ?? "");
        await MailgunService.sendEmail(
          customer.email,
          "Priceup: Quote preview",
          html
        );
      }
    }
    handleResponse(res, 200, "Success", resp);
  } catch (err) {
    handleError(res, err);
  }
};
