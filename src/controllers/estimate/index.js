const { userRoles, estimateStatus } = require("../../config/common");
const CompanyService = require("../../services/company");
const CustomerService = require("../../services/customer");
const EstimateService = require("../../services/estimate");
const LayoutService = require("../../services/layout");
const StaffService = require("../../services/staff");
const UserService = require("../../services/user");
const {
  nestedObjectsToDotNotation,
  getCurrentDate,
  getListsData,
} = require("../../utils/common");
const { handleResponse, handleError } = require("../../utils/responses");

exports.getAll = async (req, res) => {
  try {
    const company_id = req.company_id;
    const estimates = await EstimateService.findAll({ company_id });
    const result = await Promise.all(
      estimates.map(async (estimate) => {
        const layoutData = await LayoutService.findBy({
          _id: estimate.layout_id,
        });
        let creator = null;
        switch (estimate.creator_type) {
          case userRoles.ADMIN:
            creator = await UserService.findBy({ _id: estimate.creator_id });
            break;
          case userRoles.STAFF:
            creator = await StaffService.findBy({ _id: estimate.creator_id });
            break;
          default:
            break;
        }
        const customer = await CustomerService.findBy({
          _id: estimate.customer_id,
        });
        const estimateObject = estimate.toObject();
        return {
          ...estimateObject,
          layoutData: layoutData
            ? {
                image: layoutData.image,
                name: layoutData.name,
                _id: layoutData._id,
              }
            : null,
          creatorData: creator
            ? {
                name: creator.name,
                image: creator.image,
                email: creator.email,
              }
            : null,
          customerData: customer
            ? {
                name: customer.name,
                email: customer.email,
              }
            : null,
        };
      })
    );
    handleResponse(res, 200, "All Estimates", result);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getEstimate = async (req, res) => {
  const { id } = req.params;
  EstimateService.findBy({ _id: id })
    .then(async (estimate) => {
      const layoutData = await LayoutService.findBy({ id: estimate.layout_id });
      handleResponse(res, 200, "Success", {
        ...estimate,
        layout: {
          image: layoutData.image,
          name: layoutData.name,
          _id: layoutData._id,
        },
      });
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
    const customer = await CustomerService.findByAndUpdate(
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
      customer_id: customer._id,
      company_id: company_id,
    });
    handleResponse(res, 200, "Estimate created successfully", estimate);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getEstimateTotals = async (req, res) => {
  const company_id = req.company_id;
  try {
    const estimates = await EstimateService.findAll({ company_id: company_id });
    let total = 0;
    let pending = 0;
    let voided = 0;
    let approved = 0;
    estimates.map((estimate) => {
      total += estimate.cost;
      switch (estimate.status) {
        case estimateStatus.PENDING:
          pending += 1;
          break;
        case estimateStatus.VOIDED:
          voided += 1;
          break;
        case estimateStatus.APPROVED:
          approved += 1;
          break;
        default:
          break;
      }
    });
    handleResponse(res, 200, "Estimates Data", {
      total: total,
      pending: pending,
      approved: approved,
      voided: voided,
    });
  } catch (error) {
    handleError(res, error);
  }
};
