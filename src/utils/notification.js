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
const ProjectService = require("@services/project");
const StaffService = require("@services/staff");
const UserService = require("@services/user");
const WineCellarFinishService = require("@services/wineCellar/finish");
const WineCellarGlassAddonService = require("@services/wineCellar/glassAddon");
const WineCellarGlassTypeService = require("@services/wineCellar/glassType");
const WineCellarHardwareService = require("@services/wineCellar/hardware");
const WineCellarLayoutService = require("@services/wineCellar/layout");

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

const fetchDocumentsByIds = async (ids,Service) => {
  try {
    const documents = await Service.findAll({ _id: { $in: ids } });
    return documents.map((doc) => doc.toObject());
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

const fetchDocumentsByIdsWithCount = async (items,Service) => {
  const ids = items.map(item => item.type);

  // Query the database
  const foundItems = await Service.findAll({ _id: { $in: ids } });

  // Map the results to the desired format
  const result = items.map(item => {
      const foundItem = foundItems.find(i => i._id.toString() === item.type);
      return { item: foundItem, count: item.count };
  });

  return result;
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
      // throw new Error("Estimate not found");
      return null;
    }

    const estimateObject = estimate.toObject();
    let layoutData = null;
    if(estimate?.category === estimateCategory.SHOWERS){
      layoutData = await LayoutService.findBy({
        _id: estimate?.config?.layout_id,
      });
    } else if(estimate?.category === estimateCategory.WINECELLARS){
      layoutData = await WineCellarLayoutService.findBy({
        _id: estimate?.config?.layout_id,
      });
    }
    
    const creator = await getCreator(
      estimate.creator_type,
      estimate.creator_id
    );
    let customer = null;
    if(estimate?.project_id){
      const project = await ProjectService.findBy({_id:estimate?.project_id});
      customer = project?.customerData;
    }

    const modifiedObject = {
      ...estimateObject,
      settings: layoutData
        ? {
            measurementSides: layoutData.settings?.measurementSides,
            noOfHoursToCompleteSingleDoor: layoutData.settings?.noOfHoursToCompleteSingleDoor ?? 0,
            image: layoutData.image,
            name: layoutData.name,
            _id: layoutData._id,
            variant: layoutData.settings?.variant,
            heavyDutyOption: layoutData.settings?.heavyDutyOption,
            hinges: layoutData.settings?.hinges,
            glassType: estimateObject.config?.glassType,
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
      case estimateCategory.WINECELLARS:
          missingProps = await getWineCellarMissingProps(estimate);
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
      ? await fetchDocumentsByIds(estimate.config?.glassAddons,GlassAddonService)
      : [];
  let noGlassAddons = null;
  if(glassAddons?.length <= 0){
  noGlassAddons = await GlassAddonService?.findBy({
    slug: "no-treatment",
  });
  }
  const hardwareAddons =
  estimate.config?.hardwareAddons?.length > 0
    ? await fetchDocumentsByIdsWithCount(estimate.config?.hardwareAddons,HardwareService)
    : [];
  const wallClamp = estimate.config?.mountingClamps?.wallClamp?.length > 0
  ? await fetchDocumentsByIdsWithCount(estimate.config?.mountingClamps?.wallClamp,HardwareService)
  : [];
  const sleeveOver = estimate.config?.mountingClamps?.sleeveOver?.length > 0
  ? await fetchDocumentsByIdsWithCount(estimate.config?.mountingClamps?.sleeveOver,HardwareService)
  : [];
  const glassToGlass = estimate.config?.mountingClamps?.glassToGlass?.length > 0
  ? await fetchDocumentsByIdsWithCount(estimate.config?.mountingClamps?.glassToGlass,HardwareService)
  : [];
  const cornerWallClamp = estimate.config?.cornerClamps?.wallClamp?.length > 0
  ? await fetchDocumentsByIdsWithCount(estimate.config?.cornerClamps?.wallClamp,HardwareService)
  : [];
  const cornerSleeveOver = estimate.config?.cornerClamps?.sleeveOver?.length > 0
  ? await fetchDocumentsByIdsWithCount(estimate.config?.cornerClamps?.sleeveOver,HardwareService)
  : [];
  const cornerGlassToGlass = estimate.config?.cornerClamps?.glassToGlass?.length > 0
  ? await fetchDocumentsByIdsWithCount(estimate.config?.cornerClamps?.glassToGlass,HardwareService)
  : [];
  return {
    hardwareFinishes: finishes,
    handles: handles,
    hinges: hinges,
    mountingChannel: mountingChannel,
    slidingDoorSystem: slidingDoorSystem,
    header: header,
    glassType: glassType,
    glassAddons: glassAddons?.length ? glassAddons : [noGlassAddons],
    hardwareAddons: hardwareAddons,
    wallClamp: wallClamp,
    sleeveOver: sleeveOver,
    glassToGlass: glassToGlass,
    cornerWallClamp: cornerWallClamp,
    cornerSleeveOver: cornerSleeveOver,
    cornerGlassToGlass: cornerGlassToGlass,
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
    ? await fetchDocumentsByIdsWithCount(estimate.config?.hardwares,MirrorHardwareService)
    : [];

  // const hardwares =
  //   estimate.config?.hardwares?.length > 0
  //     ? await MirrorHardwareService.findAll({
  //         _id: { $in: estimate.config?.hardwares },
  //       })
  //     : [];

  return {
    glassType: glassType,
    edgeWork: edgeWork,
    glassAddons: glassAddons,
    hardwares: hardwares,
  };
};

const getWineCellarMissingProps = async (estimate) => {
  const finishes = await WineCellarFinishService.findBy({
    _id: estimate.config.hardwareFinishes,
  });
  const handles = estimate.config?.handles?.type
    ? {
        item: await WineCellarHardwareService.findBy({
          _id: estimate.config.handles?.type,
        }),
        count: estimate.config.handles.count,
      }
    : { item: null, count: 0 };
  const hinges = estimate.config?.hinges?.type
    ? {
        item: await WineCellarHardwareService.findBy({
          _id: estimate.config.hinges?.type,
        }),
        count: estimate.config.hinges.count,
      }
    : { item: null, count: 0 };
  const doorLock = estimate.config?.doorLock?.type
    ? {
        item: await WineCellarHardwareService.findBy({
          _id: estimate.config.doorLock?.type,
        }),
        count: estimate.config.doorLock.count,
      }
    : { item: null, count: 0 };
  const mountingChannel = estimate.config?.mountingChannel
    ? await WineCellarHardwareService.findBy({ _id: estimate.config.mountingChannel })
    : null;
  const slidingDoorSystem = estimate.config?.slidingDoorSystem?.type
    ? {
        item: await WineCellarHardwareService.findBy({
          _id: estimate.config.slidingDoorSystem?.type,
        }),
        count: estimate.config.slidingDoorSystem.count,
      }
    : { item: null, count: 0 };
  const header = estimate.config?.header?.type
    ? {
        item: await WineCellarHardwareService.findBy({
          _id: estimate.config.header?.type,
        }),
        count: estimate.config.header.count,
      }
    : { item: null, count: 0 };
  const glassType = estimate.config?.glassType?.type
    ? {
        item: await WineCellarGlassTypeService.findBy({
          _id: estimate.config.glassType?.type,
        }),
        thickness: estimate.config.glassType.thickness,
      }
    : { item: null, thickness: "3/8" };
  const glassAddons =
    estimate.config?.glassAddons?.length > 0
      ? await fetchDocumentsByIds(estimate.config?.glassAddons,WineCellarGlassAddonService)
      : [];
  let noGlassAddons = null;
  if(glassAddons?.length <= 0){
  noGlassAddons = await WineCellarGlassAddonService?.findBy({
    slug: "no-treatment",
  });
  }
  const hardwareAddons =
  estimate.config?.hardwareAddons?.length > 0
    ? await fetchDocumentsByIdsWithCount(estimate.config?.hardwareAddons,WineCellarHardwareService)
    : [];
  const wallClamp = estimate.config?.mountingClamps?.wallClamp?.length > 0
    ? await fetchDocumentsByIdsWithCount(estimate.config?.mountingClamps?.wallClamp,WineCellarHardwareService)
    : [];
  const sleeveOver = estimate.config?.mountingClamps?.sleeveOver?.length > 0
    ? await fetchDocumentsByIdsWithCount(estimate.config?.mountingClamps?.sleeveOver,WineCellarHardwareService)
    : [];
  const glassToGlass = estimate.config?.mountingClamps?.glassToGlass?.length > 0
    ? await fetchDocumentsByIdsWithCount(estimate.config?.mountingClamps?.glassToGlass,WineCellarHardwareService)
    : [];
  const cornerWallClamp = estimate.config?.cornerClamps?.wallClamp?.length > 0
    ? await fetchDocumentsByIdsWithCount(estimate.config?.cornerClamps?.wallClamp,WineCellarHardwareService)
    : [];
  const cornerSleeveOver = estimate.config?.cornerClamps?.sleeveOver?.length > 0
    ? await fetchDocumentsByIdsWithCount(estimate.config?.cornerClamps?.sleeveOver,WineCellarHardwareService)
    : [];
  const cornerGlassToGlass = estimate.config?.cornerClamps?.glassToGlass?.length > 0
    ? await fetchDocumentsByIdsWithCount(estimate.config?.cornerClamps?.glassToGlass,WineCellarHardwareService)
    : [];
  return {
    hardwareFinishes: finishes,
    handles,
    hinges,
    doorLock,
    mountingChannel,
    slidingDoorSystem: slidingDoorSystem,
    header: header,
    glassType,
    glassAddons: glassAddons?.length ? glassAddons : [noGlassAddons],
    hardwareAddons: hardwareAddons,
    wallClamp: wallClamp,
    sleeveOver: sleeveOver,
    glassToGlass: glassToGlass,
    cornerWallClamp: cornerWallClamp,
    cornerSleeveOver: cornerSleeveOver,
    cornerGlassToGlass: cornerGlassToGlass,
  };
};