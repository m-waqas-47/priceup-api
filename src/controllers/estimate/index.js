const CompanyService = require("../../services/company");
const CustomerService = require("../../services/customer");
const EstimateService = require("../../services/estimate");
const LayoutService = require("../../services/layout");
const {
  nestedObjectsToDotNotation,
  getCurrentDate,
  getListsData,
} = require("../../utils/common");
const { handleResponse, handleError } = require("../../utils/responses");

exports.getAll = async (req, res) => {
  const company_id = req.company_id;
  EstimateService.findAll({ company_id: company_id })
    .then((estimates) => {
      handleResponse(res, 200, "All Estimates", estimates);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getEstimate = async (req, res) => {
  const { id } = req.params;
  EstimateService.findBy({ _id: id })
    .then(async (estimate) => {
      const layoutData = await LayoutService.findBy({ id: estimate.layout_id });
      handleResponse(res, 200, "Success", { ...estimate, layout: layoutData });
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getEstimateListsData = async (req, res) => {
  const company_id = req.company_id;
  try {
    const listsData = await getListsData(company_id);
    const companySettings = await CompanyService.findBy({ _id: company_id });

    handleResponse(res, 200, "Success", {
      ...listsData,
      miscPricing: companySettings?.miscPricing,
      fabricatingPricing: companySettings?.fabricatingPricing,
    });
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateEstimate = async (req, res) => {
  const { id } = req.params;
  const payload = { ...req.body };
  const data = await nestedObjectsToDotNotation(payload);
  EstimateService.update({ _id: id }, data)
    .then((estimate) => {
      handleResponse(res, 200, "Estimate updated successfully", estimate);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteEstimate = async (req, res) => {
  const { id } = req.params;
  EstimateService.delete({ _id: id })
    .then((estimate) => {
      handleResponse(res, 200, "Estimate deleted successfully", estimate);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.saveEstimate = async (req, res) => {
  const company_id = req.company_id;
  const data = { ...req.body };
  const customerData = data?.customerData;
  if (!customerData) {
    handleError(res, {
      statusCode: 400,
      message: "Customer Data is required!",
    });
  }
  try {
    await CustomerService.findByAndUpdate(
      {
        email: customerData?.email,
        company_id: company_id,
      },
      {
        ...customerData,
        name: `${customerData?.firstName} ${customerData?.lastName}`,
        lastQuotedOn: getCurrentDate(),
        company_id: company_id,
      },
      { upsert: true, new: true }
    );
    const estimate = await EstimateService.create({
      ...data?.estimateData,
      company_id: company_id,
    });
    handleResponse(res, 200, "Estimate created successfully", estimate);
  } catch (error) {
    handleError(res, error);
  }
};
