const CustomerService = require("../../services/customer");
const { handleError, handleResponse } = require("../../utils/responses");
const EstimateService = require("../../services/estimate");

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
// exports.getAll = async (req, res) => {
//   const company_id = req.company_id;

//   try {
//     const customers = await CustomerService.findAll({ company_id: company_id });

//     const combinedData = [];

//     for (const customer of customers) {
//       const estimateData = await EstimateService.findOne({ customer_id: customer._id });

//       if (estimateData) {
//         // Add both customer name and estimate name to the combined data
//         combinedData.push({
//           _id: customer._id,
//           name: customer.name,
//           email: customer.email,
//           estimateName: estimateData.name,
//           lastQuotedOn: customer.lastQuotedOn
//         });
//       }
//     }

//     handleResponse(res, 200, "Customers with Estimate Names", combinedData);
//   } catch (err) {
//     handleError(res, err);
//   }
// };



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
  CustomerService.create(data)
    .then((customer) => {
      handleResponse(res, 200, "Customer created successfully", customer);
    })
    .catch((err) => {
      handleError(res, err);
    });
};
