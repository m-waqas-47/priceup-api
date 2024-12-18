// const customers = require("../../models/customers");
const { default: mongoose } = require("mongoose");
const {
  multerActions,
  multerSource,
  userRoles,
} = require("../../config/common");
const CustomUserService = require("../../services/customUser");
const CustomerService = require("../../services/customer");
const EstimateService = require("../../services/estimate");
const LayoutService = require("../../services/layout");
const { addOrUpdateOrDelete } = require("../../services/multer");
const StaffService = require("../../services/staff");
const UserService = require("../../services/user");
const { isEmailAlreadyUsed, getCurrentDate } = require("../../utils/common");
const { handleError, handleResponse } = require("../../utils/responses");

exports.getAll = async (req, res) => {
  const company_id = req.user.company_id;
  const { page, limit, search = "" } = req.query; // Default page is 1 and limit is 10, adjust as needed
  const customerQuery = { company_id: new mongoose.Types.ObjectId(company_id) };
  const options = {};
  if (page && limit) {
    const skip = (page - 1) * limit;
    options.skip = skip;
    options.limit = Number(limit);
  }
  try {
    const customers = await CustomerService.findAllWithPipeline(customerQuery, search, options);
    handleResponse(res, 200, "All Customers", customers);
  } catch (err) {
    handleError(res, err);
  }
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
    const oldCustomer = await CustomerService.findBy({ _id: id });
    if (!oldCustomer) {
      throw new Error("Invalid customer ID");
    }
    const check = await isEmailAlreadyUsed(data?.email);
    if (check && oldCustomer?.email !== data?.email) {
      throw new Error("Email already exist in system.Please try with new one.");
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
};

exports.saveCustomer = async (req, res) => {
  const company_id = req.user.company_id;
  const data = { ...req.body };
  try {
    const check = await isEmailAlreadyUsed(data?.email);
    if (check) {
      throw new Error("Email already exist in system.Please try with new one.");
    }
    const query = {
      name: data.name,
      company_id: company_id,
    };
    if (data?.email) {
      query.email = data.email;
    }
    if (data?.phone) {
      query.phone = data.phone;
    }

    const existingCustomer = await CustomerService.findBy(query);
    if (existingCustomer) {
      throw new Error(
        "Customer already exists with the same details. Please select from the existing list."
      );
    } else {
      const customer = await CustomerService.create({ ...data, company_id });
      handleResponse(res, 200, "Customer created successfully", customer);
    }
  } catch (err) {
    handleError(res, err);
  }
};

exports.getCustomerEstimates = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.company_id;
    const { page = 1, limit = 10 } = req.query; // Default page is 1 and limit is 10, adjust as needed
    const skip = (page - 1) * limit;

    const [
      estimatesCount,
      estimates,
      layouts,
      customers,
      users,
      customUsers,
      staffs,
    ] = await Promise.all([
      EstimateService.count({ customer_id: id }),
      EstimateService.findAll({ customer_id: id }, { skip, limit }),
      LayoutService.findAll({ company_id }),
      CustomerService.findAll({ company_id }),
      UserService.findAll(),
      CustomUserService.findAll(),
      StaffService.findAll(),
    ]);

    const result = await Promise.all(
      estimates.map(async (estimate) => {
        const layoutData = layouts.find(
          (item) => item.id === estimate?.config?.layout_id?.toString()
        );
        let creator = null;
        switch (estimate.creator_type) {
          case userRoles.ADMIN:
            creator = users.find(
              (item) => item.id === estimate?.creator_id?.toString()
            );
            if (!creator) {
              creator = customUsers.find(
                (item) => item.id === estimate?.creator_id?.toString()
              );
            }
            break;
          case userRoles.STAFF:
            creator = staffs.find(
              (item) => item.id === estimate?.creator_id?.toString()
            );
            break;
          case userRoles.CUSTOM_ADMIN:
            creator = customUsers.find(
              (item) => item.id === estimate?.creator_id?.toString()
            );
            break;
          default:
            break;
        }
        const customer = customers.find(
          (item) => item.id === estimate?.customer_id?.toString()
        );
        const estimateObject = estimate.toObject();
        return {
          ...estimateObject,
          settings: layoutData
            ? {
                measurementSides: layoutData.settings.measurementSides,
                image: layoutData.image,
                name: layoutData.name,
                _id: layoutData._id,
                variant: layoutData.settings.variant,
                heavyDutyOption: layoutData.settings.heavyDutyOption,
                hinges: layoutData.settings.hinges,
                glassType: estimateObject.config.glassType,
              }
            : null,
          creatorData: creator
            ? {
                name: creator.name,
                image: creator.image,
                email: creator.email,
              }
            : null,
          customerData: customer
            ? {
                name: customer.name,
                email: customer.email,
              }
            : null,
        };
      })
    );

    handleResponse(res, 200, "All Estimates", {
      totalRecords: estimatesCount,
      estimates: result,
    });
  } catch (err) {
    handleError(res, err);
  }
};

exports.addOrUpdateCustomerEstimateRelation = async (
  customerData,
  company_id
) => {
  try {
    if (customerData?.id) {
      let customer = await CustomerService.findBy({
        _id: customerData?.id,
        company_id: company_id,
      });
      if (customer) {
        const customerUpdated = await CustomerService.update(
          { _id: customer._id },
          { lastQuotedOn: getCurrentDate() }
        );
        return customerUpdated;
      } else {
        throw new Error("Customer not found.");
      }
    } else {
      // Dynamically constructing the query object
      const query = {
        name: `${customerData?.firstName} ${customerData?.lastName}`,
        company_id: company_id,
      };
      if (customerData?.email) {
        query.email = customerData.email;
      }
      if (customerData?.phone) {
        query.phone = customerData.phone;
      }

      const existingCustomer = await CustomerService.findBy(query);
      if (existingCustomer) {
        throw new Error(
          "Customer already exists with the same details. Please select from the existing list."
        );
      } else {
        let created = await CustomerService.create({
          ...customerData,
          name: `${customerData?.firstName} ${customerData?.lastName}`,
          lastQuotedOn: getCurrentDate(),
          company_id: company_id,
        });

        return created;
      }
    }
  } catch (err) {
    throw err;
  }
};

exports.modifyExistingRecords = async (req, res) => {
  const customers = await CustomerService.findAll();
  try {
    await Promise.all(
      customers?.map(async (customer) => {
        await CustomerService.update({ _id: customer._id }, { phone: "" });
      })
    );
    handleResponse(res, 200, "Customers info updated");
  } catch (err) {
    handleError(res, err);
  }
};
