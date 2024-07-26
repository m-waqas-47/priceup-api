const { projectStatus } = require("@config/common");
const ProjectService = require("@services/project");
const { handleError, handleResponse } = require("@utils/responses");
const { default: mongoose } = require("mongoose");
const Service = ProjectService;
exports.getAll = async (req, res) => {
  try {
    const company_id = req.user.company_id;
    const { page = 1, limit = 10, search = "" } = req.query; // Added search query
    const skip = (page - 1) * limit;
    const { totalRecords, projects } = await Service.findAll(
      { company_id: new mongoose.Types.ObjectId(company_id) },
      search,
      { skip, limit: Number(limit) }
    );

    handleResponse(res, 200, "All Records", { totalRecords, projects });
  } catch (err) {
    handleError(res, err);
  }
};

exports.getSingleRecord = async (req, res) => {
  const { id } = req.params;
  try {
    const record = await Service.findBy({ _id:  new mongoose.Types.ObjectId(id) });
    handleResponse(res, 200, "Single Record", record);
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
    const record = await Service.findBy({ _id: new mongoose.Types.ObjectId(id) });
    if (!record) {
      throw new Error("Invalid ID");
    }
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
  console.log(data,'data');
  try {
    const record = await Service.create(data);
    handleResponse(res, 200, "Record created successfully", record);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getAllStats = async (req, res) => {
  const company_id = req.user.company_id;
  try {
    const records = await Service.findAll({ company_id: company_id });
    let total = 0;
    let pending = 0;
    let voided = 0;
    let approved = 0;
    records.forEach((record) => {
      total += record.totalAmountQuoted;
      switch (record.status) {
        case projectStatus.PENDING:
          pending += 1;
          break;
        case projectStatus.VOIDED:
          voided += 1;
          break;
        case projectStatus.APPROVED:
          approved += 1;
          break;
        default:
          break;
      }
    });
    handleResponse(res, 200, "Project Stats", {
      total: total,
      pending: pending,
      approved: approved,
      voided: voided,
    });
  } catch (err) {
    handleError(res, err);
  }
};
