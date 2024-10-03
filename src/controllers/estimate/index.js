const {
  userRoles,
  estimateStatus,
  notificationCategories,
  notificationActions,
} = require("@config/common");
const CustomerService = require("@services/customer");
const EstimateService = require("@services/estimate");
const LayoutService = require("@services/layout");
const StaffService = require("@services/staff");
const { nestedObjectsToDotNotation } = require("@utils/common");
const { handleResponse, handleError } = require("@utils/responses");
const { addOrUpdateCustomerEstimateRelation } = require("../customer");
const { generateNotifications } = require("@utils/notification");
const { default: mongoose } = require("mongoose");
const ProjectService = require("@services/project");

exports.getAll = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const { page = 1, limit = 10, search = "", status, date } = req.query; // Added search query
    const skip = (page - 1) * limit;
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
    const { totalRecords, estimates } =
      await EstimateService.findAllWithPipeline(query, search, {
        skip,
        limit: Number(limit),
      });
    handleResponse(res, 200, "Records", { totalRecords, estimates });
  } catch (err) {
    handleError(res, err);
  }
};

exports.getEstimate = async (req, res) => {
  const { id } = req.params;
  EstimateService.findBy({ _id: id })
    .then(async (estimate) => {
      const layoutData = await LayoutService.findBy({
        id: estimate?.config?.layout_id,
      });
      handleResponse(res, 200, "Success", {
        ...estimate,
        layout: layoutData
          ? {
              image: layoutData.image,
              name: layoutData.name,
              _id: layoutData._id,
            }
          : null,
      });
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getEstimatesByProject = async (req, res) => {
  const { projectId } = req.params;
  const {
    page = 1,
    limit = 10,
    category,
    search = "",
    status,
    date,
  } = req.query; // Added search query
  const skip = (page - 1) * limit;
  try {
    const query = { project_id: new mongoose.Types.ObjectId(projectId) };
    if (category) {
      query.category = category;
    }
    if (status) {
      query.status = status;
    }
    if (date) {
      const inputDate = new Date(date);
      const startOfDay = new Date(inputDate.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(inputDate.setUTCHours(23, 59, 59, 999));
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }
    const { totalRecords, estimates } =
      await EstimateService.findAllWithPipeline(query, search, {
        skip,
        limit: Number(limit),
      });
    handleResponse(res, 200, "Records", { totalRecords, estimates });
  } catch (err) {
    handleError(res, err);
  }
};

exports.getEstimatesByCustomer = async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10, search = "", status, date } = req.query; // Added search query
  const skip = (page - 1) * limit;
  try {
    const query = {};
    if (status) {
      query.status = status;
    }
    if (date) {
      const inputDate = new Date(date);
      const startOfDay = new Date(inputDate.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(inputDate.setUTCHours(23, 59, 59, 999));
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }
    const { totalRecords, estimates } =
      await EstimateService.findAllWithPipeline(
        query,
        search,
        {
          skip,
          limit: Number(limit),
        },
        id
      );
    handleResponse(res, 200, "Records", { totalRecords, estimates });
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateEstimate = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { customerData, estimateData } = req.body;
  const data = await nestedObjectsToDotNotation(estimateData);
  try {
    const oldRecord = await EstimateService.findBy({ _id: id });
    if (!oldRecord) {
      throw new Error("Invalid estimate ID");
    }

    const estimate = await EstimateService.update({ _id: id }, data);
    await generateNotifications(
      notificationCategories.ESTIMATES,
      notificationActions.UPDATE,
      user,
      estimate._id
    );
    if(data?.cost){
    // Calculate the new totalAmountQuoted
    const updatedEstimatePrice = data.cost;
    const oldEstimatePrice = oldRecord.cost;
    // Update the project's totalAmountQuoted
    await ProjectService.update(
      { _id: oldRecord.project_id },
      { $inc: { totalAmountQuoted: updatedEstimatePrice - oldEstimatePrice } }
    );}
    handleResponse(res, 200, "Estimate updated successfully", estimate);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteEstimate = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  try {
    const estimate = await EstimateService.findBy({ _id: id });
    if (!estimate) {
      throw new Error("Estimate not found");
    }
    // const count = await EstimateService.count({
    //   customer_id: estimate.customer_id,
    // });
    // if (count <= 1) {
    //   CustomerService.delete({ _id: estimate.customer_id });
    // }
    const resp = await EstimateService.delete({ _id: id });
    // Subtract the estimate's cost from the totalAmountQuoted in the associated project
    await ProjectService.update(
      { _id: resp.project_id },
      { $inc: { totalAmountQuoted: -resp.cost } }
    );
    await generateNotifications(
      notificationCategories.ESTIMATES,
      notificationActions.DELETE,
      user,
      estimate._id
    );

    handleResponse(res, 200, "Estimate deleted successfully", resp);
  } catch (err) {
    handleError(res, err);
  }
};

exports.saveEstimate = async (req, res) => {
  const user = req.user;
  const company_id = req.user.company_id;
  const data = { ...req.body };
  // const customerData = data?.customerData;

  // if (!customerData) {
  //   return handleError(res, new Error("Customer Data is required!"));
  // }

  try {
    if (data?.estimateData?.creator_type === userRoles.STAFF) {
      await StaffService.update(
        { _id: data?.estimateData?.creator_id },
        {
          $inc: { totalQuoted: data?.estimateData?.cost },
          lastQuoted: new Date(),
        }
      );
    }

    await ProjectService.update(
      { _id: data?.estimateData?.project_id },
      {
        $inc: { totalAmountQuoted: data?.estimateData?.cost },
      }
    );

    // const customer = await addOrUpdateCustomerEstimateRelation(
    //   customerData,
    //   company_id
    // );
    const estimate = await EstimateService.create({
      ...data?.estimateData,
      // customer_id: customer._id,
      company_id: company_id,
    });

    await generateNotifications(
      notificationCategories.ESTIMATES,
      notificationActions.CREATE,
      user,
      estimate._id
    );

    handleResponse(res, 200, "Estimate created successfully", estimate);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getAllStats = async (req, res) => {
  const company_id = req.user.company_id;
  try {
    const estimates = await EstimateService.findAll({ company_id: company_id });
    let total = 0;
    let pending = 0;
    let voided = 0;
    let approved = 0;
    estimates.forEach((estimate) => {
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
    handleResponse(res, 200, "Estimates Stats", {
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
  try {
    // Update all estimates where category is 'mirrors' and hardwares array exists
    await EstimateService.updateMany(
      { 
        category: "mirrors", 
        "config.hardwares": { $exists: true, $type: "array" }
      },
      [{
        // MongoDB aggregation pipeline to transform the hardwares array
        $set: {
          "config.hardwares": {
            $map: {
              input: "$config.hardwares",
              as: "hardware",
              in: {
                type: { $toObjectId: "$$hardware" }, // Convert string to ObjectId
                count: 1
              }
            }
          }
        }
      }]
    );
   
    console.log(`Estimates updated successfully`);
    handleResponse(res,200,`Estimates updated successfully`);
  } catch (error) {
    console.error("Error updating estimates:", error);
    handleError(res,error);
  }
};