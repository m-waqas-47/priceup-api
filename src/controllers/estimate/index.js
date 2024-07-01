const { userRoles, estimateStatus } = require("@config/common");
const CompanyService = require("@services/company");
const CustomUserService = require("@services/customUser");
const CustomerService = require("@services/customer");
const EstimateService = require("@services/estimate");
const LayoutService = require("@services/layout");
const StaffService = require("@services/staff");
const UserService = require("@services/user");
const { nestedObjectsToDotNotation } = require("@utils/common");
const { handleResponse, handleError } = require("@utils/responses");
const { addOrUpdateCustomerEstimateRelation } = require("../customer");

exports.getAll = async (req, res) => {
  try {
    const company_id = req.company_id;
    const { page = 1, limit = 10, search = "" } = req.query; // Added search query
    const skip = (page - 1) * limit;

    let customerIds = [];
    if (search) {
      // Find customers based on the search keyword
      const customers = await CustomerService.findAll({
        company_id,
        name: { $regex: search, $options: "i" },
      });
      customerIds = customers.map((customer) => customer.id);
    }

    // Filter estimates based on the customer IDs if search keyword is provided
    const estimateQuery = { company_id };
    if (search && customerIds.length > 0) {
      estimateQuery.customer_id = { $in: customerIds };
    }

    const [
      estimatesCount,
      estimates,
      layouts,
      customers,
      users,
      customUsers,
      staffs,
    ] = await Promise.all([
      EstimateService.count(estimateQuery),
      EstimateService.findAll(estimateQuery, { skip, limit }),
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

// exports.getAll = async (req, res) => {
//   try {
//     const company_id = req.company_id;
//     const { page = 1, limit = 10, search = "" } = req.query; // Default page is 1 and limit is 10, adjust as needed
//     const skip = (page - 1) * limit;

//     let estimatesCount = EstimateService.count({ company_id });
//     // Fetch customers based on search criteria
//     const customersData = await CustomerService.findAll({ company_id });
//     let newLimit = limit;
//     let newSkip = skip;
//     let customers = customersData;
//     if (search) {
//       customers = customersData.filter((customer) =>
//         customer.name.toLowerCase().includes(search.toLowerCase())
//       );
//       console.log(customers, "filteredCustomers");
//       estimatesCount = customers?.length;
//       newLimit = customers?.length;
//       newSkip = (page - 1) * newLimit;
//     }

//     const [
//       // estimatesCount,
//       estimates,
//       layouts,
//       // customers,
//       users,
//       customUsers,
//       staffs,
//     ] = await Promise.all([
//       EstimateService.findAll(
//         { company_id },
//         {
//           skip: newSkip,
//           limit: newLimit,
//         }
//       ),
//       LayoutService.findAll({ company_id }),
//       // CustomerService.findAll({ company_id }),
//       UserService.findAll(),
//       CustomUserService.findAll(),
//       StaffService.findAll(),
//     ]);

//     const result = await Promise.all(
//       estimates.map(async (estimate) => {
//         const layoutData = layouts.find(
//           (item) => item.id === estimate?.config?.layout_id?.toString()
//         );
//         let creator = null;
//         switch (estimate.creator_type) {
//           case userRoles.ADMIN:
//             creator = users.find(
//               (item) => item.id === estimate?.creator_id?.toString()
//             );
//             if (!creator) {
//               creator = customUsers.find(
//                 (item) => item.id === estimate?.creator_id?.toString()
//               );
//             }
//             break;
//           case userRoles.STAFF:
//             creator = staffs.find(
//               (item) => item.id === estimate?.creator_id?.toString()
//             );
//             break;
//           case userRoles.CUSTOM_ADMIN:
//             creator = customUsers.find(
//               (item) => item.id === estimate?.creator_id?.toString()
//             );
//             break;
//           default:
//             break;
//         }

//         const customer = customers.find(
//           (item) => item.id === estimate?.customer_id?.toString()
//         );
//         // console.log(customer, "customer");
//         const estimateObject = estimate.toObject();
//         return {
//           ...estimateObject,
//           settings: layoutData
//             ? {
//                 measurementSides: layoutData.settings.measurementSides,
//                 image: layoutData.image,
//                 name: layoutData.name,
//                 _id: layoutData._id,
//                 variant: layoutData.settings.variant,
//                 heavyDutyOption: layoutData.settings.heavyDutyOption,
//                 hinges: layoutData.settings.hinges,
//                 glassType: estimateObject.config.glassType,
//               }
//             : null,
//           creatorData: creator
//             ? {
//                 name: creator.name,
//                 image: creator.image,
//                 email: creator.email,
//               }
//             : null,
//           customerData: customer
//             ? {
//                 name: customer.name,
//                 email: customer.email,
//               }
//             : null,
//         };
//       })
//     );

//     handleResponse(res, 200, "All Estimates", {
//       totalRecords: estimatesCount,
//       estimates: result,
//     });
//   } catch (err) {
//     handleError(res, err);
//   }
// };

exports.getEstimate = async (req, res) => {
  const { id } = req.params;
  EstimateService.findBy({ _id: id })
    .then(async (estimate) => {
      const layoutData = await LayoutService.findBy({ id: estimate.layout_id });
      handleResponse(res, 200, "Success", {
        ...estimate,
        layout: {
          image: layoutData.image,
          name: layoutData.name,
          _id: layoutData._id,
        },
      });
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.updateEstimate = async (req, res) => {
  const { id } = req.params;
  const { customerData, estimateData } = req.body;
  const data = await nestedObjectsToDotNotation(estimateData);
  EstimateService.update({ _id: id }, data)
    .then((estimate) => {
      handleResponse(res, 200, "Estimate updated successfully", estimate);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteEstimate = async (req, res) => {
  const { id } = req.params;
  EstimateService.findBy({ _id: id })
    .then((estimate) => {
      if (!estimate) {
        return res.status(404).json({ message: "Estimate not found" });
      }

      const customerId = estimate.customer_id;
      EstimateService.count({ customer_id: customerId })
        .then((count) => {
          if (count <= 1) {
            Promise.all([
              EstimateService.delete({ _id: id }),
              CustomerService.delete({ _id: customerId }),
            ])
              .then(() => {
                handleResponse(
                  res,
                  200,
                  "Estimate and customer deleted successfully"
                );
              })
              .catch((err) => {
                handleError(res, err);
              });
          } else {
            EstimateService.delete({ _id: id })
              .then(() => {
                handleResponse(res, 200, "Estimate deleted successfully");
              })
              .catch((err) => {
                handleError(res, err);
              });
          }
        })
        .catch((err) => {
          handleError(res, err);
        });
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.saveEstimate = async (req, res) => {
  const company_id = req.company_id;
  const data = { ...req.body };
  const customerData = data?.customerData;

  if (!customerData) {
    return handleError(res, new Error("Customer Data is required!"));
  }

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

    const customer = await addOrUpdateCustomerEstimateRelation(
      customerData,
      company_id
    );
    const estimate = await EstimateService.create({
      ...data?.estimateData,
      customer_id: customer._id,
      company_id: company_id,
    });

    handleResponse(res, 200, "Estimate created successfully", estimate);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getAllStats = async (req, res) => {
  const company_id = req.company_id;
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
  const estimates = await EstimateService.findAll();

  try {
    await Promise.all(
      estimates?.map(async (estimate) => {
        (estimate.category = "showers"),
          (estimate.config = {
            layout_id: estimate.layout_id,
            isCustomizedDoorWidth: estimate.isCustomizedDoorWidth,
            doorWidth: estimate.doorWidth,
            hardwareFinishes: estimate.hardwareFinishes,
            handles: { ...estimate.handles },
            hinges: { ...estimate.hinges },
            mountingClamps: { ...estimate.mountingClamps },
            cornerClamps: { ...estimate.cornerClamps },
            mountingChannel: estimate.mountingChannel,
            glassType: { ...estimate.glassType },
            slidingDoorSystem: { ...estimate.slidingDoorSystem },
            header: { ...estimate.header },
            glassAddons: estimate.glassAddons,
            hardwareAddons: estimate.hardwareAddons,
            oneInchHoles: estimate.oneInchHoles,
            hingeCut: estimate.hingeCut,
            clampCut: estimate.clampCut,
            notch: estimate.notch,
            outages: estimate.outages,
            mitre: estimate.mitre,
            polish: estimate.polish,
            people: estimate.people,
            hours: estimate.hours,
            additionalFields: estimate.additionalFields,
            measurements: estimate.measurements,
            perimeter: estimate.perimeter,
            sqftArea: estimate.sqftArea,
            userProfitPercentage: estimate.userProfitPercentage,
          });

        // Remove old fields
        estimate.layout_id = undefined;
        estimate.isCustomizedDoorWidth = undefined;
        estimate.doorWidth = undefined;
        estimate.hardwareFinishes = undefined;
        estimate.handles = undefined;
        estimate.hinges = undefined;
        estimate.mountingClamps = undefined;
        estimate.cornerClamps = undefined;
        estimate.mountingChannel = undefined;
        estimate.glassType = undefined;
        estimate.slidingDoorSystem = undefined;
        estimate.header = undefined;
        estimate.glassAddons = undefined;
        estimate.hardwareAddons = undefined;
        estimate.oneInchHoles = undefined;
        estimate.hingeCut = undefined;
        estimate.clampCut = undefined;
        estimate.notch = undefined;
        estimate.outages = undefined;
        estimate.mitre = undefined;
        estimate.polish = undefined;
        estimate.people = undefined;
        estimate.hours = undefined;
        estimate.additionalFields = undefined;
        estimate.measurements = undefined;
        estimate.perimeter = undefined;
        estimate.sqftArea = undefined;
        estimate.userProfitPercentage = undefined;
        return estimate.save();
      })
    );
    handleResponse(res, 200, "Estimates info updated");
  } catch (err) {
    handleError(res, err);
  }
};
