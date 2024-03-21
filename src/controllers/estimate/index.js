const { userRoles, estimateStatus } = require("../../config/common");
const CompanyService = require("../../services/company");
const CustomUserService = require("../../services/customUser");
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
const { addOrUpdateCustomerEstimateRelation } = require("../customer");

exports.getAll = async (req, res) => {
  try {
    const company_id = req.company_id;
    const estimates = await EstimateService.findAll({ company_id });
    let total = 0;
    let pending = 0;
    let voided = 0;
    let approved = 0;
    const result = await Promise.all(
      estimates.map(async (estimate) => {
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
        const layoutData = await LayoutService.findBy({
          _id: estimate.layout_id,
        });
        let creator = null;
        switch (estimate.creator_type) {
          case userRoles.ADMIN:
            creator = await UserService.findBy({ _id: estimate.creator_id });
            if (!creator) {
              creator = await CustomUserService.findBy({
                _id: estimate.creator_id,
              });
            }
            break;
          case userRoles.STAFF:
            creator = await StaffService.findBy({ _id: estimate.creator_id });
            break;
          case userRoles.CUSTOM_ADMIN:
            creator = await CustomUserService.findBy({
              _id: estimate.creator_id,
            });
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
          settings: layoutData
            ? {
                measurementSides: layoutData.settings.measurementSides,
                image: layoutData.image,
                name: layoutData.name,
                _id: layoutData._id,
                variant: layoutData.settings.variant,
                heavyDutyOption: layoutData.settings.heavyDutyOption,
                hinges: layoutData.settings.hinges,
                glassType: estimateObject.glassType,
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
    handleResponse(res, 200, "All Estimates", {
      estimates: result,
      total: total,
      pending: pending,
      voided: voided,
      approved: approved,
    });
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
    const [listsData, companySettings] = await Promise.all([
      getListsData(company_id),
      CompanyService.findBy({ _id: company_id }),
    ]);

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
  const { customerData, estimateData } = req.body;
  const data = await nestedObjectsToDotNotation(estimateData);
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
  EstimateService.findBy({ _id: id })
    .then((estimate) => {
      if (!estimate) {
        return res.status(404).json({ message: "Estimate not found" });
      }

      const customerId = estimate.customer_id;
      EstimateService.count({ customer_id: customerId })
        .then((count) => {
          if (count <= 1) {
            Promise.all([
              EstimateService.delete({ _id: id }),
              CustomerService.delete({ _id: customerId }),
            ])
              .then(() => {
                handleResponse(
                  res,
                  200,
                  "Estimate and customer deleted successfully"
                );
              })
              .catch((err) => {
                handleError(res, err);
              });
          } else {
            EstimateService.delete({ _id: id })
              .then(() => {
                handleResponse(res, 200, "Estimate deleted successfully");
              })
              .catch((err) => {
                handleError(res, err);
              });
          }
        })
        .catch((err) => {
          handleError(res, err);
        });
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
    throw new Error("Customer Data is required!");
  }
  try {
    const customer = await addOrUpdateCustomerEstimateRelation(
      customerData,
      company_id
    );
    const estimate = await EstimateService.create({
      ...data?.estimateData,
      customer_id: customer._id,
      company_id: company_id,
    });
    handleResponse(res, 200, "Estimate created successfully", estimate);
  } catch (err) {
    handleError(res, err);
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
  } catch (err) {
    handleError(res, err);
  }
};

exports.modifyExistingRecords = async (req, res) => {
  const estimates = await EstimateService.findAll();

  try {
    await Promise.all(
      estimates?.map(async (estimate) => {
        await EstimateService.update({ _id: estimate._id }, { label: "" });
      })
    );
    handleResponse(res, 200, "Estimates info updated");
  } catch (err) {
    handleError(res, err);
  }
};
