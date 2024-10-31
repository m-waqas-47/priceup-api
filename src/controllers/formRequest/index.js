const CompanyService = require("@services/company");
const { handleError, handleResponse } = require("@utils/responses");


exports.getLocations = async (req,res) => {
  try{
    const locations = await CompanyService.findAll({},'name _id');
   handleResponse(res,200,'All Locations',locations?.length)
  }
  catch(err){
    handleError(res,err);
  }
}

exports.getCustomerRequest = (req, res) => {
  try {
    const data = { ...req.body };
    handleResponse(res, 200, "Success", data);
  } catch (err) {
    handleError(res, err);
  }
};
