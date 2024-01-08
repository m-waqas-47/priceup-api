const customers = require("../../models/customers");
const CustomerService = require("../../services/customer");
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
      let customer = await CustomerService.findBy({
        email: customerData?.email,
        // phone: customerData?.phone,
        company_id: company_id,
      });
      
      if (customer) {
        // Check if the update would result in a duplicate key
        const isDuplicate = await CustomerService.findBy({
          email: customerData?.email,
          // phone: customerData?.phone,
          company_id: company_id,
          _id: { $ne: customer._id }, // Exclude the current document from the check
        });
      
        if (isDuplicate) {
          // Handle the duplicate key scenario (e.g., inform the user or take appropriate action)
          // You might want to update the existing record instead of throwing an error
          console.error('Duplicate key violation during update');
          reject('Duplication of primary key');
        } else {
          customer = await CustomerService.update(
            { _id: customer._id },
            {
              name: `${customerData?.firstName} ${customerData?.lastName}`,
              address: customerData?.address,
              lastQuotedOn: getCurrentDate(),
            },
            { new: true }
          );
        }
      } else {
        customer = await CustomerService.create({
          ...customerData,
          name: `${customerData?.firstName} ${customerData?.lastName}`,
          lastQuotedOn: getCurrentDate(),
          company_id: company_id,
        });
      }   
      resolve(customer);   
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