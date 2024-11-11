const CompanyService = require("@services/company");
const CustomerInvoicePreviewService = require("@services/customerInvoicePreview");
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
      const [location, showersHardware, mirrorsHardware, wineCellarsHardware] =
        await Promise.all([
          CompanyService.findBy({ _id: invoicePreviewRecord.company_id }),
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
      });
    } else {
      return handleResponse(res, 200, "No preview found", null);
    }
  } catch (err) {}
};

exports.createInvoicePreview = async (req, res) => {
  const data = { ...req.body };
  try {
    const resp = await CustomerInvoicePreviewService.create({ ...data });
    handleResponse(res, 200, "Invoice preview generated", resp);
  } catch (err) {
    handleError(res, err);
  }
};
