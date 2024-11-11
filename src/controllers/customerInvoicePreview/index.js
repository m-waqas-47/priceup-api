const CompanyService = require("@services/company");
const CustomerInvoicePreviewService = require("@services/customerInvoicePreview");
const EstimateService = require("@services/estimate");
const { sendEmail } = require("@services/mailgun");
const {
  getShowersHardwareList,
  getMirrorsHardwareList,
  getWineCellarsHardwareList,
} = require("@utils/common");
const { handleError, handleResponse } = require("@utils/responses");

exports.getCustomerInvoicePreview = async (req, res) => {
  const { id } = req.params;
  try {
    const invoicePreviewRecord = await CustomerInvoicePreviewService.findBy({
      _id: id,
    });
    if (invoicePreviewRecord) {
      const [location, estimatesList, showersHardware, mirrorsHardware, wineCellarsHardware] =
        await Promise.all([
          CompanyService.findBy({ _id: invoicePreviewRecord.company_id }),
          EstimateService.findAll({project_id:invoicePreviewRecord.project_id}),
          getShowersHardwareList(invoicePreviewRecord.company_id),
          getMirrorsHardwareList(invoicePreviewRecord.company_id),
          getWineCellarsHardwareList(invoicePreviewRecord.company_id),
        ]);
      return handleResponse(res, 200, "Preview data found", {
        ...data,
        location,
        showersHardware,
        mirrorsHardware,
        wineCellarsHardware,
        estimatesList
      });
    } else {
      return handleResponse(res, 200, "No preview found", null);
    }
  } catch (err) {}
};

exports.createInvoicePreview = async (req, res) => {
  const data = { ...req.body };
  try {
    const findReq = await CustomerInvoicePreviewService.findBy({project_id:data.project_id,company_id:data.company_id});
    if(findReq){
        await CustomerInvoicePreviewService.delete({_id:findReq._id});
    }
    const resp = await CustomerInvoicePreviewService.create({ ...data });
    // await sendEmail()
    handleResponse(res, 200, "Invoice preview generated", resp);
  } catch (err) {
    handleError(res, err);
  }
};
