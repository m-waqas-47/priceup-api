const { userRoles } = require("@config/common");
const CustomerService = require("@services/customer");
const EstimateService = require("@services/estimate");
const ProjectService = require("@services/project");
const { getTodayRange } = require("@utils/common");
const { handleResponse, handleError } = require("@utils/responses");
const { default: mongoose } = require("mongoose");

exports.getDashboardGraphData = async (req, res) => {
  const user = req.user;
  const { startDate, endDate } = req.query;
  const query = {};
  try {
    if (!user?.role) {
      throw new Error("User role is required");
    }
    if (userRoles !== userRoles.SUPER_ADMIN && user?.company_id) {
      query.company_id = new mongoose.Types.ObjectId(user?.company_id);
    }
    // If no dates are provided, use today's date as default
    if (!startDate || !endDate) {
      const { startOfDay, endOfDay } = getTodayRange();
      query.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    } else {
      const start = new Date(startDate);
      const end = new Date(endDate);
      query.createdAt = {
        $gte: new Date(start.setUTCHours(0, 0, 0, 0)),
        $lte: new Date(end.setUTCHours(23, 59, 59, 999)),
      };
    }

    const estimatePipeline = EstimateService.graphData(query);
    const projectPipeline = ProjectService.graphData(query);
    const customerPipeline = CustomerService.graphData(query);
    // Run all aggregations concurrently
    const [estimates, projects, customers] = await Promise.all([
      estimatePipeline,
      projectPipeline,
      customerPipeline,
    ]);

    handleResponse(res, 200, "Graph Data", { estimates, projects, customers });
  } catch (err) {
    handleError(res, err);
  }
};

exports.getDashboardStats = async (req,res) => {
  const user = req.user;
  let query = {};
  try{
    if (!user?.role) {
      throw new Error("User role is required");
    }
    if (userRoles !== userRoles.SUPER_ADMIN && user?.company_id) {
      query.company_id = new mongoose.Types.ObjectId(user?.company_id);
    }
    const estimateQuery = EstimateService.count(query);
    const projectQuery = ProjectService.count(query);
    const customerQuery = CustomerService.count(query);
    // Run all aggregations concurrently
    const [estimateCount, projectCount, customerCount] = await Promise.all([
      estimateQuery,
      projectQuery,
      customerQuery,
    ]);

    handleResponse(res, 200, "Stats", { estimateCount, projectCount, customerCount});
  }
  catch(err){
    handleError(res,err);
  }
}