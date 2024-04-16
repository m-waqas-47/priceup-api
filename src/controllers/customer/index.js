// const customers = require("../../models/customers");
const { multerActions, multerSource } = require("../../config/common");
const CustomerService = require("../../services/customer");
const { addOrUpdateOrDelete } = require("../../services/multer");
const { isEmailAlreadyUsed, getCurrentDate } = require("../../utils/common");
const { handleError, handleResponse } = require("../../utils/responses");

exports.getAll = async (req, res) => {
  const company_id = req.company_id;
  CustomerService.findAll({ company_id: company_id })
    .then((customers) => {
      handleResponse(res, 200, "All Customers", customers);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getCustomer = async (req, res) => {
  const { id } = req.params;
  CustomerService.findBy({ _id: id })
    .then((customer) => {
      handleResponse(res, 200, "Success", customer);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  try {
    const check = await isEmailAlreadyUsed(data?.email);
    if (check) {
      throw new Error("Email already exist in system.Please try with new one.");
    }
    const oldCustomer = await CustomerService.findBy({ _id: id });
    if (!oldCustomer) {
      throw new Error("Invalid customer ID");
    }

    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.CUSTOMERS,
        req.file.filename,
        oldCustomer.image
      );
    }
    const customer = await CustomerService.update({ _id: id }, data);
    handleResponse(res, 200, "Customer info updated successfully", customer);
  } catch (err) {
    handleError(res, err);
  }
}

exports.saveCustomer = async (req, res) => {
  const data = req.body;
  try {
    const check = await isEmailAlreadyUsed(data?.email);
    if (check) {
      throw new Error("Email already exist in system.Please try with new one.");
    }
    const customer = await CustomerService.create(data);
    handleResponse(res, 200, "Customer created successfully", customer);
  } catch (err) {
    handleError(res, err);
  }
};

exports.addOrUpdateCustomerEstimateRelation = async (customerData,company_id) =>{
  return new Promise(async(resolve,reject)=>{
     try{  
      if(customerData?.id){
        let customer = await CustomerService.findBy({_id:customerData?.id});
        if(customer){
          resolve(customer);
        }
        else{
          customer = await CustomerService.create({
            ...customerData,
          name: `${customerData?.firstName} ${customerData?.lastName}`,
          lastQuotedOn: getCurrentDate(),
          company_id: company_id,
          });
          resolve(customer);
        }
      }
      else{
        let customer = await CustomerService.create({
          ...customerData,
        name: `${customerData?.firstName} ${customerData?.lastName}`,
        lastQuotedOn: getCurrentDate(),
        company_id: company_id,
        });
        resolve(customer);
      }
     }
     catch(err){
         reject(err);
     }
  });
}

exports.modifyExistingRecords = async (req, res) => {
  const customers = await CustomerService.findAll();
  try {
    await Promise.all(
      customers?.map(async (customer) => {
        await CustomerService.update(
          { _id: customer._id },
          { phone: "" }
        );
      })
    );
    handleResponse(res, 200, "Customers info updated");
  } catch (err) {
    handleError(res, err);
  }
};