const { estimateCategory } = require("@config/common");
const CompanyService = require("@services/company");
const { handleError, handleResponse } = require("@utils/responses");
const { default: mongoose } = require("mongoose");


exports.getLocations = async (req,res) => {
  try{
    const locations = await CompanyService.findAll({},'name _id image');
   handleResponse(res,200,'All Locations',locations)
  }
  catch(err){
    handleError(res,err);
  }
}

exports.getLocationData = async (req,res) => {
  try{
    const {id} = req.params;
    const {category = ''} = req.query;
    if(!id){
      throw new Error('Id is required');
    }
    if(![estimateCategory.SHOWERS,estimateCategory.MIRRORS,estimateCategory.WINECELLARS].includes(category)){
      throw new Error('Invalid category provided');
    }
    const result = await CompanyService.findAllDataRelatedToCompanyByCategory({_id: new mongoose.Types.ObjectId(id) },category)
   handleResponse(res,200,'Data',result);
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
