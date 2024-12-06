const { projectStatus } = require("@config/common");
const CustomerInvoicePreviewService = require("@services/customerInvoicePreview");
const EstimateService = require("@services/estimate");
const InvoiceService = require("@services/invoice");
const ProjectService = require("@services/project");
const { handleError, handleResponse } = require("@utils/responses");
const { default: mongoose } = require("mongoose");
const Service = ProjectService;
exports.getAll = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const { page = 1, limit = 10, search = "", status, date } = req.query; // Added search query
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
    const skip = (page - 1) * limit;
    const { totalRecords, projects } = await Service.findAll(query, search, {
      skip,
      limit: Number(limit),
    });

    handleResponse(res, 200, "All Records", { totalRecords, projects });
  } catch (err) {
    handleError(res, err);
  }
};

exports.getCustomerProjects = async (req, res) => {
  const { id } = req.params;
  const company_id = req.user.company_id;
  try {
    const { page = 1, limit = 10, search = "", status, date } = req.query; // Added search query
    const query = {
      company_id: new mongoose.Types.ObjectId(company_id),
      customer_id: new mongoose.Types.ObjectId(id),
    };
    if (status) {
      query.status = status;
    }
    if (date) {
      const inputDate = new Date(date);
      const startOfDay = new Date(inputDate.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(inputDate.setUTCHours(23, 59, 59, 999));
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }
    const skip = (page - 1) * limit;
    const { totalRecords, projects } = await Service.findAll(query, search, {
      skip,
      limit: Number(limit),
    });

    handleResponse(res, 200, "All Records", { totalRecords, projects });
  } catch (err) {
    handleError(res, err);
  }
};

exports.getProjectAllEstimates = async (req, res) => {
  const { id } = req.params;
  // const company_id = req.user.company_id;
  try {
    if (!id) {
      throw new Error("Project Id is required");
    }
    const result = await EstimateService.findAllWithPipeline({
      project_id: new mongoose.Types.ObjectId(id),
    });
    handleResponse(res, 200, "All estimates of project", result?.estimates);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getSingleRecord = async (req, res) => {
  const { id } = req.params;
  try {
    const record = await Service.findBy({
      _id: new mongoose.Types.ObjectId(id),
    });
    const invoice = await InvoiceService.findBy({
      source_id: new mongoose.Types.ObjectId(id),
    });
    handleResponse(res, 200, "Single Record", { ...record, invoice: invoice });
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateRecord = async (req, res) => {
  //   const user = req.user;
  const { id } = req.params;
  const data = { ...req.body };
  try {
    const record = await Service.update({ _id: id }, data);
    handleResponse(res, 200, "Record Updated", record);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteRecord = async (req, res) => {
  //   const user = req.user;
  const { id } = req.params;
  try {
    const record = await Service.findBy({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!record) {
      throw new Error("Invalid ID");
    }
    await EstimateService.deleteAll({ project_id: id });
    const resp = await Service.delete({ _id: id });
    handleResponse(res, 200, "Record Deleted", resp);
  } catch (err) {
    handleError(res, err);
  }
};

exports.saveRecord = async (req, res) => {
  const user = req.user;
  const data = {
    ...req.body,
    company_id: user.company_id,
    creator_id: user.id,
    creator_type: user.role,
  };
  try {
    const record = await Service.create(data);
    handleResponse(res, 200, "Record created successfully", record);
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Another project already exists with the same name.";
    }
    handleError(res, err);
  }
};

exports.getAllStats = async (req, res) => {
  const company_id = req.user.company_id;
  try {
    const resp = await Service.stats({
      company_id: new mongoose.Types.ObjectId(company_id),
    });
    let counts = {
      total: 0,
      pending: 0,
      voided: 0,
      approved: 0,
    };
    handleResponse(res, 200, "Project Stats", {
      ...counts,
      ...resp?.statusCounts,
      total: resp?.total ?? 0,
    });
  } catch (err) {
    handleError(res, err);
  }
};

exports.modifyExistingDocuments = async (req, res) => {
  try {
    // Update all existing documents by setting lastLogin and lastReminderSent to the current time if they don't exist
    const result = await Service.updateMany(
      {
        contact_id: { $exists: false },
        opportunity_id: { $exists: false },
        created_source: { $exists: false },
      },
      {
        $set: {
          contact_id: null,
          opportunity_id: null,
          created_source: "Application",
        },
      }
    );
    handleResponse(res, 200, "Records modified", result);
  } catch (err) {
    handleError(res, err);
  }
};
