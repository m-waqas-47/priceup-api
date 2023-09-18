const FinishService = require("../services/finish");
const GlassAddonService = require("../services/glassAddon");
const GlassTypeService = require("../services/glassType");
const HardwareService = require("../services/hardware");

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
// exports.nestedObjectsToDotNotation = (object) => {
//   const updatedObject = {};

//   // Process the payload to convert nested objects into dot notation
//   for (const key in object) {
//     if (typeof object[key] === "object") {
//       for (const nestedKey in object[key]) {
//         updatedObject[`${key}.${nestedKey}`] = object[key][nestedKey];
//       }
//     } else {
//       updatedObject[key] = object[key];
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
      Object.assign(updatedObject, nestedObject);
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

exports.getListsData = (company_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const finishes = await FinishService.findAll({ company_id: company_id });
      const handles = await HardwareService.findAllBy({
        hardware_category_slug: "handles",
        company_id: company_id,
      });
      const hinges = await HardwareService.findAllBy({
        hardware_category_slug: "hinges",
        company_id: company_id,
      });
      const mountingChannel = await HardwareService.findAllBy({
        hardware_category_slug: "mounting-channels",
        company_id: company_id,
      });

      const mountingClamps = await HardwareService.findAllBy({
        hardware_category_slug: "mounting-clamps",
        company_id: company_id,
      });

      const slidingDoorSystem = await HardwareService.findAllBy({
        hardware_category_slug: "sliding-door-system",
        company_id: company_id,
      });
      const transom = await HardwareService.findAllBy({
        hardware_category_slug: "transom",
        company_id: company_id,
      });
      const header = await HardwareService.findAllBy({
        hardware_category_slug: "header",
        company_id: company_id,
      });
      const hardwareAddons = await HardwareService.findAllBy({
        hardware_category_slug: "add-ons",
        company_id: company_id,
      });
      const glassType = await GlassTypeService.findAll({
        company_id: company_id,
      });
      const glassAddons = await GlassAddonService.findAll({
        company_id: company_id,
      });

      const listData = {
        hardwareFinishes: finishes,
        handles: handles,
        hinges: hinges,
        pivotHingeOption: hinges,
        heavyDutyOption: hinges,
        heavyPivotOption: hinges,
        channelOrClamps: ["Channel", "Clamps"],
        mountingChannel: mountingChannel,
        wallClamp: mountingClamps,
        sleeveOver: mountingClamps,
        glassToGlass: mountingClamps,
        glassType: glassType,
        slidingDoorSystem: slidingDoorSystem,
        transom: transom,
        header: header,
        glassAddons: glassAddons,
        hardwareAddons: hardwareAddons,
      };
      resolve(listData);
    } catch (error) {
      reject(error);
    }
  });
};
