const CompanyService = require("@services/company");
const CustomerService = require("@services/customer");
const CustomerInvoicePreviewService = require("@services/customerInvoicePreview");
const EstimateService = require("@services/estimate");
const MailgunService = require("@services/mailgun");
const ProjectService = require("@services/project");
const { invoicePreviewTemplate } = require("@templates/email");
const {
  getShowersHardwareList,
  getMirrorsHardwareList,
  getWineCellarsHardwareList,
} = require("@utils/common");
const { handleError, handleResponse } = require("@utils/responses");
const { default: mongoose } = require("mongoose");

exports.getCustomerInvoicePreview = async (req, res) => {
  const { id } = req.params;
  try {
    const invoicePreviewRecord = await CustomerInvoicePreviewService.findBy({
      _id: id,
    });
    if (invoicePreviewRecord) {
      const [
        location,
        estimatesList,
        showersHardware,
        mirrorsHardware,
        wineCellarsHardware,
      ] = await Promise.all([
        CompanyService.findBy({ _id: invoicePreviewRecord.company_id }),
        EstimateService.findAll({
          project_id: invoicePreviewRecord.project_id,
        }),
        getShowersHardwareList(invoicePreviewRecord.company_id),
        getMirrorsHardwareList(invoicePreviewRecord.company_id),
        getWineCellarsHardwareList(invoicePreviewRecord.company_id),
      ]);

      return handleResponse(res, 200, "Preview data found", {
        project_id: invoicePreviewRecord.project_id,
        location,
        showersHardware,
        mirrorsHardware,
        wineCellarsHardware,
        estimatesList,
      });
    } else {
      return handleResponse(res, 200, "No preview found", null);
    }
  } catch (err) {
    handleError(res, err);
  }
};

exports.createInvoicePreview = async (req, res) => {
  const data = { ...req.body };
  try {
    const findReq = await CustomerInvoicePreviewService.findBy({
      project_id: data.project_id,
      company_id: data.company_id,
    });
    if (findReq) {
      await CustomerInvoicePreviewService.delete({ _id: findReq._id });
    }
    const resp = await CustomerInvoicePreviewService.create({ ...data });
    const customer = await CustomerService.findBy({
      _id: new mongoose.Types.ObjectId(data?.customer_id),
    });
    console.log(customer,"customer");
    if (customer) {
      const html = invoicePreviewTemplate(resp._id);
      await MailgunService.sendEmail(customer.email, "Invoice preview link", html);
    }
    handleResponse(res, 200, "Invoice preview generated", resp);
  } catch (err) {
    handleError(res, err);
  }
};
