const MirrorEdgeWorkService = require("@services/mirror/edgeWork");
const AdminService = require("../services/admin");
const CustomUserService = require("../services/customUser");
const FinishService = require("../services/finish");
const GlassAddonService = require("../services/glassAddon");
const GlassTypeService = require("../services/glassType");
const HardwareService = require("../services/hardware");
const StaffService = require("../services/staff");
const UserService = require("../services/user");
const MirrorGlassTypeService = require("@services/mirror/glassType");
const MirrorGlassAddonService = require("@services/mirror/glassAddon");
const MirrorHardwareService = require("@services/mirror/hardware");
const MailgunService = require("@services/mailgun");
const { userRoles, multerSource } = require("@config/common");

exports.generateRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

exports.isEmailAlreadyUsed = async (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserService.findBy({ email: email });
      if (user) {
        resolve(true);
      }
      const admin = await AdminService.findBy({ email: email });
      if (admin) {
        resolve(true);
      }
      const staff = await StaffService.findBy({ email: email });
      if (staff) {
        resolve(true);
      }
      const customUser = await CustomUserService.findBy({ email: email });
      if (customUser) {
        resolve(true);
      }
      resolve(false);
    } catch (error) {
      reject(error);
    }
  });
};

// exports.nestedObjectsToDotNotation = (object, parentKey = "") => {
//   const updatedObject = {};

//   for (const key in object) {
//     const nestedKey = parentKey ? `${parentKey}.${key}` : key;
//     const value = object[key];
//     // console.log(nestedKey,value,'value');

//     if (typeof value === "object" && !Array.isArray(value)) {
//       const nestedObject = exports.nestedObjectsToDotNotation(value, nestedKey);
//       Object.assign(updatedObject, nestedObject);
//     } else {
//       updatedObject[nestedKey] = value;
//     }
//   }

//   return updatedObject;
// };

exports.nestedObjectsToDotNotation = (object, parentKey = "") => {
  const updatedObject = {};

  for (const key in object) {
    const nestedKey = parentKey ? `${parentKey}.${key}` : key;
    const value = object[key];

    if (typeof value === "object" && !Array.isArray(value)) {
      const nestedObject = exports.nestedObjectsToDotNotation(value, nestedKey);
      if (Object.keys(nestedObject).length === 0) {
        // If the nestedObject is empty, set nestedKey to null
        updatedObject[nestedKey] = null;
      } else {
        Object.assign(updatedObject, nestedObject);
      }
    } else {
      updatedObject[nestedKey] = value;
    }
  }

  return updatedObject;
};

exports.getCurrentDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

exports.getShowersHardwareList = async (company_id) => {
  try {
    const [
      finishes,
      handles,
      hinges,
      mountingChannel,
      mountingClamps,
      cornerClamps,
      slidingDoorSystem,
      transom,
      header,
      hardwareAddons,
      glassType,
      glassAddons,
    ] = await Promise.all([
      FinishService.findAll({ company_id }),
      HardwareService.findAllBy({
        hardware_category_slug: "handles",
        company_id,
      }),
      HardwareService.findAllBy({
        hardware_category_slug: "hinges",
        company_id,
      }),
      HardwareService.findAllBy({
        hardware_category_slug: "mounting-channels",
        company_id,
      }),
      HardwareService.findAllBy({
        hardware_category_slug: "mounting-clamps",
        company_id,
      }),
      HardwareService.findAllBy({
        hardware_category_slug: "corner-clamps",
        company_id,
      }),
      HardwareService.findAllBy({
        hardware_category_slug: "sliding-door-system",
        company_id,
      }),
      HardwareService.findAllBy({
        hardware_category_slug: "transom",
        company_id,
      }),
      HardwareService.findAllBy({
        hardware_category_slug: "header",
        company_id,
      }),
      HardwareService.findAllBy({
        hardware_category_slug: "add-ons",
        company_id,
      }),
      GlassTypeService.findAll({ company_id }),
      GlassAddonService.findAll({ company_id }),
    ]);

    const listData = {
      hardwareFinishes: finishes,
      handles,
      hinges,
      pivotHingeOption: hinges,
      heavyDutyOption: hinges,
      heavyPivotOption: hinges,
      channelOrClamps: ["Channel", "Clamps", "Corner Clamps"],
      mountingChannel,
      wallClamp: mountingClamps,
      sleeveOver: mountingClamps,
      glassToGlass: mountingClamps,
      cornerWallClamp: cornerClamps,
      cornerSleeveOver: cornerClamps,
      cornerGlassToGlass: cornerClamps,
      glassType,
      slidingDoorSystem,
      transom,
      header,
      glassAddons,
      hardwareAddons,
    };

    return listData;
  } catch (error) {
    throw error;
  }
};

exports.getMirrorsHardwareList = async (company_id) => {
  try {
    const [edgeWorks, glassTypes, glassAddons, hardwares] = await Promise.all([
      MirrorEdgeWorkService.findAll({ company_id }),
      MirrorGlassTypeService.findAll({ company_id }),
      MirrorGlassAddonService.findAll({ company_id }),
      MirrorHardwareService.findAll({ company_id }),
    ]);

    const listData = {
      edgeWorks,
      glassTypes,
      glassAddons,
      hardwares,
    };

    return listData;
  } catch (error) {
    throw error;
  }
};

exports.getWineCellarHardwareList = async (company_id) => {
  try {
    const [
      finishes,
      handles,
      hinges,
      mountingChannel,
      glassType,
      // glassAddons,
    ] = await Promise.all([
      WineCellarFinishService.findAll({ company_id }),
      WineCellarHardwareService.findAllBy({
        hardware_category_slug: "handles",
        company_id,
      }),
      WineCellarHardwareService.findAllBy({
        hardware_category_slug: "hinges",
        company_id,
      }),
      WineCellarHardwareService.findAllBy({
        hardware_category_slug: "mounting-channels",
        company_id,
      }),
      WineCellarGlassTypeService.findAll({ company_id }),
      // GlassAddonService.findAll({ company_id }),
    ]);

    const listData = {
      hardwareFinishes: finishes,
      handles,
      hinges,
      heavyDutyOption: hinges,
      channelOrClamps: ["Channel"],
      mountingChannel,
      glassType,
      // glassAddons,
    };

    return listData;
  } catch (error) {
    throw error;
  }
};

exports.validateEmail = async (email) => {
  const emailVerified = await MailgunService.verifyEmail(email);
  if (emailVerified.result !== "deliverable") {
    throw new Error("Email is not valid. Please enter a correct one.");
  }
}

exports.checkIfEmailExists = async (email) => {
  const emailUsed = await this.isEmailAlreadyUsed(email);
  if (emailUsed) {
    throw new Error("Email already exists in the system. Please try with a new one.");
  }
}

exports.getMulterSource = (role) => {
  switch (role) {
    case userRoles.STAFF:
      return multerSource.STAFFS;
    case userRoles.CUSTOM_ADMIN:
      return multerSource.CUSTOMUSERS;
    default:
      return multerSource.ADMINS;
  }
}

exports.generateFinishes = (finish) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hardwareFinishes = await finish?.flatMap((finish) => [
        // generate hardware finishes of user
        {
          name: finish?.name,
          slug: finish?.slug,
          image: finish?.image,
          partNumber: finish?.partNumber,
          // holesNeeded: finish?.holesNeeded,
          cost: finish?.cost,
          status: false,
          finish_id: finish?.id,
        },
      ]);
      resolve(hardwareFinishes);
    } catch (error) {
      reject(error);
    }
  });
};