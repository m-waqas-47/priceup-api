const {
  notificationCategories,
  userRoles,
  estimateCategory,
} = require("@config/common");
const AdminService = require("@services/admin");
const CompanyService = require("@services/company");
const CustomerService = require("@services/customer");
const CustomUserService = require("@services/customUser");
const EstimateService = require("@services/estimate");
const FinishService = require("@services/finish");
const GlassAddonService = require("@services/glassAddon");
const GlassTypeService = require("@services/glassType");
const HardwareService = require("@services/hardware");
const LayoutService = require("@services/layout");
const MirrorEdgeWorkService = require("@services/mirror/edgeWork");
const MirrorGlassAddonService = require("@services/mirror/glassAddon");
const MirrorGlassTypeService = require("@services/mirror/glassType");
const MirrorHardwareService = require("@services/mirror/hardware");
const NotificationService = require("@services/notification");
const StaffService = require("@services/staff");
const UserService = require("@services/user");

exports.generateNotifications = async (
  category,
  action,
  performer,
  resourceId
) => {
  try {
    const notificationPromises = [];

    switch (category) {
      case notificationCategories.ESTIMATES:
        if (
          [userRoles.ADMIN, userRoles.CUSTOM_ADMIN].includes(performer.role)
        ) {
          const allSuperAdmins = await AdminService.findAll();
          allSuperAdmins?.forEach((superAdmin) => {
            notificationPromises.push(
              NotificationService.create({
                category,
                description: `Estimate ${action} successfully`,
                performer_id: performer.id,
                performer_role: performer.role,
                performer_name: performer.name,
                action,
                resource_id: resourceId,
                viewer: superAdmin._id,
                company_id: performer.company_id,
              })
            );
          });
        } else if (performer.role === userRoles.STAFF) {
          const company = await CompanyService.findBy({
            _id: performer.company_id,
          });
          if (company) {
            notificationPromises.push(
              NotificationService.create({
                category,
                description: `Estimate ${action} successfully`,
                performer_id: performer.id,
                performer_role: performer.role,
                performer_name: performer.name,
                action,
                resource_id: resourceId,
                viewer: company.user_id,
                company_id: performer.company_id,
              })
            );

            const customAdmins = await CustomUserService.findAll({
              locationsAccess: { $in: [company._id] },
            });
            customAdmins?.forEach((customAdmin) => {
              notificationPromises.push(
                NotificationService.create({
                  category,
                  description: `Estimate ${action} successfully`,
                  performer_id: performer.id,
                  performer_role: performer.role,
                  performer_name: performer.name,
                  action,
                  resource_id: resourceId,
                  viewer: customAdmin._id,
                  company_id: performer.company_id,
                })
              );
            });

            const allSuperAdmins = await AdminService.findAll();
            allSuperAdmins?.forEach((superAdmin) => {
              notificationPromises.push(
                NotificationService.create({
                  category,
                  description: `Estimate ${action} successfully`,
                  performer_id: performer.id,
                  performer_role: performer.role,
                  performer_name: performer.name,
                  action,
                  resource_id: resourceId,
                  viewer: superAdmin._id,
                  company_id: performer.company_id,
                })
              );
            });
          }
        }
        break;
      default:
        break;
    }

    // Wait for all notifications to be created
    await Promise.all(notificationPromises);
  } catch (error) {
    throw error;
  }
};

// exports.getResourceInfo = async (resource) => {
//   try {
//     switch (resource.category) {
//       case notificationCategories.ESTIMATES:
//         // fetch estimate
//         const estimate = await EstimateService.findBy({ _id: resource.id });
//         const estimateObject = estimate.toObject();
//         // fetch layout data
//         const layoutData = await LayoutService.findBy({
//           _id: estimate?.config?.layout_id,
//         });
//         // fetch estimate creater data
//         let creator = null;
//         switch (estimate.creator_type) {
//           case userRoles.ADMIN:
//             creator = await UserService.findBy({ _id: estimate?.creator_id });
//             if (!creator) {
//               creator = await CustomUserService.findBy({
//                 _id: estimate?.creator_id,
//               });
//             }
//             break;
//           case userRoles.STAFF:
//             creator = StaffService.findBy({ _id: estimate?.creator_id });
//             break;
//           case userRoles.CUSTOM_ADMIN:
//             creator = await CustomUserService.findBy({
//               _id: estimate?.creator_id,
//             });
//             break;
//           default:
//             break;
//         }
//         // customer info
//         const customer = await CustomerService.findBy({
//           _id: estimate?.customer_id,
//         });
//         let missingProps = null;
//         let modifiedObject = {
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
//         switch (estimate.category) {
//           case estimateCategory.SHOWERS:
//             missingProps = await getShowersMissingProps(estimate);
//             break;
//           case estimateCategory.MIRRORS:
//             missingProps = await getMirrorsMissingProps(estimate);
//             break;
//         }
//         return {...modifiedObject,resourceInfoWithFullObjects:missingProps}
//       default:
//         return null;
//     }
//   } catch (error) {
//     throw error;
//   }
// };

const getUserById = async (id) => {
  let user = await UserService.findBy({ _id: id });
  if (!user) {
    user = await CustomUserService.findBy({ _id: id });
  }
  return user;
};

const getCreator = async (creatorType, creatorId) => {
  switch (creatorType) {
    case userRoles.ADMIN:
      return getUserById(creatorId);
    case userRoles.STAFF:
      return StaffService.findBy({ _id: creatorId });
    case userRoles.CUSTOM_ADMIN:
      return CustomUserService.findBy({ _id: creatorId });
    default:
      return null;
  }
};

const fetchDocumentsByIds = async (Model, ids) => {
  try {
    const documents = await Model.findAll({ _id: { $in: ids } });
    console.log(documents, "doc", Model);
    return documents.map((doc) => doc.toObject());
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

// Main function
exports.getResourceInfo = async (resource) => {
  try {
    if (!resource.category || !resource.id) {
      throw new Error("Invalid resource data");
    }

    if (resource.category !== notificationCategories.ESTIMATES) {
      return null;
    }

    const estimate = await EstimateService.findBy({ _id: resource.id });
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    const estimateObject = estimate.toObject();
    const layoutData = await LayoutService.findBy({
      _id: estimate?.config?.layout_id,
    });
    const creator = await getCreator(
      estimate.creator_type,
      estimate.creator_id
    );
    const customer = await CustomerService.findBy({
      _id: estimate?.customer_id,
    });

    const modifiedObject = {
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

    let missingProps = null;
    switch (estimate.category) {
      case estimateCategory.SHOWERS:
        missingProps = await getShowersMissingProps(estimate);
        break;
      case estimateCategory.MIRRORS:
        missingProps = await getMirrorsMissingProps(estimate);
        break;
      default:
        break;
    }

    return { ...modifiedObject, resourceInfoWithFullObjects: missingProps };
  } catch (error) {
    console.error("Error in getResourceInfo:", error);
    throw error;
  }
};

// Helper functions for missing properties
const getShowersMissingProps = async (estimate) => {
  const finishes = await FinishService.findBy({
    _id: estimate.config.hardwareFinishes,
  });
  const handles = estimate.config?.handles?.type
    ? {
        item: await HardwareService.findBy({
          _id: estimate.config.handles?.type,
        }),
        count: estimate.config.handles.count,
      }
    : { item: null, count: 0 };
  const hinges = estimate.config?.hinges?.type
    ? {
        item: await HardwareService.findBy({
          _id: estimate.config.hinges?.type,
        }),
        count: estimate.config.hinges.count,
      }
    : { item: null, count: 0 };
  const mountingChannel = estimate.config?.mountingChannel
    ? await HardwareService.findBy({ _id: estimate.config.mountingChannel })
    : null;
  const slidingDoorSystem = estimate.config?.slidingDoorSystem?.type
    ? {
        item: await HardwareService.findBy({
          _id: estimate.config.slidingDoorSystem?.type,
        }),
        count: estimate.config.slidingDoorSystem.count,
      }
    : { item: null, count: 0 };
  const header = estimate.config?.header?.type
    ? {
        item: await HardwareService.findBy({
          _id: estimate.config.header?.type,
        }),
        count: estimate.config.header.count,
      }
    : { item: null, count: 0 };
  const glassType = estimate.config?.glassType?.type
    ? {
        item: await GlassTypeService.findBy({
          _id: estimate.config.glassType?.type,
        }),
        thickness: estimate.config.glassType.thickness,
      }
    : { item: null, thickness: "3/8" };
  const glassAddons =
    estimate.config?.glassAddons?.length > 0
      ? await GlassAddonService.findAll({
          _id: { $in: estimate.config?.glassAddons },
        })
      : [];
  const noGlassAddons = await GlassAddonService?.findBy({
    slug: "no-treatment",
  });

  return {
    hardwareFinishes: finishes,
    handles: handles,
    hinges: hinges,
    mountingChannel: mountingChannel,
    slidingDoorSystem: slidingDoorSystem,
    header: header,
    glassType: glassType,
    glassAddons: glassAddons?.length ? glassAddons : [noGlassAddons],
    hardwareAddons: [],
    wallClamp: [],
    sleeveOver: [],
    glassToGlass: [],
    cornerWallClamp: [],
    cornerSleeveOver: [],
    cornerGlassToGlass: [],
  };
};

const getMirrorsMissingProps = async (estimate) => {
  const glassType = estimate.config?.glassType?.type
    ? {
        item: await MirrorGlassTypeService.findBy({
          _id: estimate.config.glassType?.type,
        }),
        thickness: estimate.config.glassType.thickness,
      }
    : { item: null, thickness: "1/4" };

  const edgeWork = estimate.config?.edgeWork?.type
    ? {
        item: await MirrorEdgeWorkService.findBy({
          _id: estimate.config.edgeWork?.type,
        }),
        thickness: estimate.config.edgeWork.thickness,
      }
    : { item: null, thickness: "1/4" };

  const glassAddons =
    estimate.config?.glassAddons?.length > 0
      ? await MirrorGlassAddonService.findAll({
          _id: { $in: estimate.config?.glassAddons },
        })
      : [];

  const hardwares =
    estimate.config?.hardwares?.length > 0
      ? await MirrorHardwareService.findAll({
          _id: { $in: estimate.config?.hardwares },
        })
      : [];

  return {
    glassType: glassType,
    edgeWork: edgeWork,
    glassAddons: glassAddons,
    hardwares: hardwares,
  };
};
