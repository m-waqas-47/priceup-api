const { estimateCategory, userRoles } = require("@config/common");
const CompanyService = require("@services/company");
const CustomerService = require("@services/customer");
const ProjectService = require("@services/project");
// const UserService = require("@services/user");
const { estimateSaveFormat } = require("@utils/generateEstimate");
const { highLevelFlow, updateHighLevelOpportunity } = require("@utils/highlevel");
const { handleError, handleResponse } = require("@utils/responses");
const { default: mongoose } = require("mongoose");

exports.getLocations = async (req, res) => {
  try {
    const locations = await CompanyService.findAll({}, "name _id image");
    handleResponse(res, 200, "All Locations", locations);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getLocationData = async (req, res) => {
  try {
    const { id } = req.params;
    const { category = "" } = req.query;
    if (!id) {
      throw new Error("Id is required");
    }
    if (
      ![
        estimateCategory.SHOWERS,
        estimateCategory.MIRRORS,
        estimateCategory.WINECELLARS,
      ].includes(category)
    ) {
      throw new Error("Invalid category provided");
    }
    const result = await CompanyService.findAllDataRelatedToCompanyByCategory(
      { _id: new mongoose.Types.ObjectId(id) },
      category
    );
    handleResponse(res, 200, "Data", result);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getCustomerRequest = async (req, res) => {
  try {
    const data = { ...req.body };
    const location = await CompanyService.findBy({ _id: data.location._id });
    if (!location) {
      throw new Error("Invalid location id");
    }
    let customer = null;
    const query = {
      name: data.customerDetail.name,
      company_id: location._id,
    };
    if (data?.customerDetail?.email) {
      query.email = data.customerDetail.email;
    }
    if (data?.customerDetail?.phone) {
      query.phone = data.customerDetail.phone;
    }

    const existingCustomer = await CustomerService.findBy(query);
    if (existingCustomer) {
      customer = existingCustomer;
    } else {
      customer = await CustomerService.create({
        ...data.customerDetail,
        company_id: location._id,
      });
    }

    const project = await ProjectService.create({
      ...data.projectDetail,
      creator_id: location.user_id,
      creator_type: userRoles.ADMIN,
      customer_id: customer._id,
      company_id: location._id,
      created_source: "Customer Form",
    });
    // Map over the records array and insert each record, returning an array of promises
    const promises = data.quotes.map((quote) =>
      estimateSaveFormat(quote, location, location.user_id, project._id)
    );

    // Wait until all promises are resolved
    const results = await Promise.all(promises);

    // Calculate the total cost by summing up each cost value from the responses
    const totalCost = results.reduce((sum, record) => sum + record.cost, 0);

    // Call highLevelFlow without awaiting it to avoid blocking the main flow
    const highLevelResp = await highLevelFlow(
      data.customerDetail,
      totalCost,
      data.contactNote
    );

    await ProjectService.update(
      { _id: project._id },
      { totalAmountQuoted: totalCost, opportunity_id: highLevelResp?.opportunity?.id ?? null }
    );

    await CustomerService.update(
      { _id: customer._id },
      { highlevel_contact_id: highLevelResp?.contact?.id ?? "" }
    );

    handleResponse(res, 200, "Request submitted successfully", results);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateCustomerRequest = async (req, res) => {
  const data = { ...req.body };
  try {
    if (!data?.project_id) {
      throw new Error("Project ref is missing");
    }
    let status = "voided";
    if (data?.status === true) {
      status = "approved";
    }
    const project = await ProjectService.update(
      { _id: new mongoose.Types.ObjectId(data.project_id) },
      { status }
    );
    if (project?.opportunity_id) {
      await updateHighLevelOpportunity(
        project?.opportunity_id,
        data?.status === true ? "won" : "lost"
      );
    }
    handleResponse(res, 200, "Request status updated", project);
  } catch (err) {
    handleError(res, err);
  }
};
