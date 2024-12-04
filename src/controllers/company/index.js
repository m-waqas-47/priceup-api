const { default: mongoose } = require("mongoose");
const {
  multerSource,
  multerActions,
  minDoorWidthStandard,
  maxDoorWidthStandard,
} = require("../../config/common");
const CompanyService = require("../../services/company");
const FinishService = require("../../services/finish");
const GlassAddonService = require("../../services/glassAddon");
const GlassTypeService = require("../../services/glassType");
const HardwareService = require("../../services/hardware");
const LayoutService = require("../../services/layout");
const MailgunService = require("../../services/mailgun");
const { addOrUpdateOrDelete } = require("../../services/multer");
const UserService = require("../../services/user");
const {
  nestedObjectsToDotNotation,
  isEmailAlreadyUsed,
  generateRandomString,
} = require("../../utils/common");
const { handleResponse, handleError } = require("../../utils/responses");
const MirrorGlassTypeService = require("@services/mirror/glassType");
const MirrorEdgeWorkService = require("@services/mirror/edgeWork");
const MirrorHardwareService = require("@services/mirror/hardware");
const MirrorGlassAddonService = require("@services/mirror/glassAddon");
const WineCellarFinishService = require("@services/wineCellar/finish");
const WineCellarHardwareService = require("@services/wineCellar/hardware");
const WineCellarGlassTypeService = require("@services/wineCellar/glassType");
const WineCellarLayoutService = require("@services/wineCellar/layout");
const WineCellarGlassAddonService = require("@services/wineCellar/glassAddon");

exports.getAll = async (req, res) => {
  CompanyService.findAll()
    .then((companies) => {
      handleResponse(res, 200, "All Companies", companies);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getAllByUserRole = async (req, res) => {
  const role = req.user.role;
  const { search = "", status = null } = req.query; // Added search query
  CompanyService.findAllByRole(role, { search, status })
    .then((records) => {
      handleResponse(res, 200, "All Records", records);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getCompany = async (req, res) => {
  const { id } = req.params;
  CompanyService.findBy({ _id: id })
    .then((company) => {
      handleResponse(res, 200, "Success", company);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.updateCompany = async (req, res) => {
  const { id } = req.params;
  const payload = { ...req.body };
  let data = await nestedObjectsToDotNotation(JSON.parse(payload.data));

  try {
    const oldcompany = await CompanyService.findBy({ _id: id });
    // if (data?.doorWidth && (data?.doorWidth < minDoorWidthStandard || data?.doorWidth > maxDoorWidthStandard)) {
    //   throw new Error(`Max door width is not in range of ${minDoorWidthStandard}-${maxDoorWidthStandard}.`);
    // }
    if (req.file && req.file.fieldname === "image") {
      console.log(data, "payload");
      const newImage = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.COMPANIES,
        req.file.filename,
        oldcompany.image
      );
      data = { ...data, image: newImage };
    }

    const company = await CompanyService.update({ _id: id }, data);
    handleResponse(res, 200, "Company updated successfully", company);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteCompany = async (req, res) => {
  const { id } = req.params;
  CompanyService.delete({ _id: id })
    .then((company) => {
      handleResponse(res, 200, "Company deleted successfully", company);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.saveCompany = async (req, res) => {
  const data = { ...req.body };
  CompanyService.create(data)
    .then((company) => {
      handleResponse(res, 200, "Company created successfully", company);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.cloneCompany = async (req, res) => {
  const password = generateRandomString(8);
  const data = { ...req.body, password: password };
  try {
    if (!data?.company_id) {
      throw new Error("Company id is required.");
    }

    if (!data?.email) {
      throw new Error("Email is required.");
    }

    // validate email
    const emailVerified = await MailgunService.verifyEmail(data?.email);
    if (emailVerified?.result !== "deliverable") {
      throw new Error("Email is not valid. Please enter a correct one.");
    }

    const check = await isEmailAlreadyUsed(data?.email);
    if (check) {
      throw new Error(
        "Email already exist in system. Please try with new one."
      );
    }

    const referenceCompany = await CompanyService.findBy({
      _id: data.company_id,
    });
    if (!referenceCompany) {
      throw new Error("Invalid company id provided.");
    }

    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.SAVE,
        multerSource.COMPANIES,
        req.file.path
      );
    } // save image if attached in payload

    const user = await UserService.create({
      ...data,
      image: "images/users/default.jpg",
    }); // create user

    const company = await CompanyService.create({
      ...referenceCompany,
      user_id: user?.id,
      name: data?.locationName,
      image:
        data?.image !== "null"
          ? data?.image
          : "images/others/company_default.jpg",
    }); // create user company

    const finishes = await FinishService.findAll({
      company_id: data.company_id,
    }); // find company finishes

    const newFinishes = await Promise.all(
      finishes?.map(async (finish) => {
        return await FinishService.create({
          ...finish,
          company_id: company._id,
          slug: finish.slug,
          name: finish.name,
          image: finish.image,
        });
      })
    ); // clone finishes

    const hardwares = await HardwareService.findAll({
      company_id: data.company_id,
    }); // find hardwares

    await Promise.all(
      hardwares?.map(async (hardware) => {
        const hardwareFinishes = hardware.finishes.map((finish) => {
          const finishFound = newFinishes.find(
            (item) => item.name === finish.name
          );
          return {
            ...finish,
            finish_id: finishFound._id,
          };
        });
        await HardwareService.create({
          ...hardware,
          company_id: company?.id,
          finishes: hardwareFinishes,
          hardware_category_slug: hardware.hardware_category_slug,
          name: hardware.name,
          slug: hardware.slug,
        });
      })
    ); // clone hardwares

    const glassTypes = await GlassTypeService.findAll({
      company_id: data.company_id,
    }); // find company glassTypes

    await Promise.all(
      glassTypes?.map(async (glassType) => {
        await GlassTypeService.create({
          ...glassType,
          company_id: company._id,
          name: glassType.name,
          slug: glassType.slug,
          options: glassType.options,
        });
      })
    ); // clone glassTypes

    const glassAddons = await GlassAddonService.findAll({
      company_id: data.company_id,
    }); // find company glassAddons

    await Promise.all(
      glassAddons?.map(async (glassAddon) => {
        await GlassAddonService.create({
          ...glassAddon,
          company_id: company._id,
          name: glassAddon.name,
          slug: glassAddon.slug,
          options: glassAddon.options,
        });
      })
    ); // clone glassAddons

    const layouts = await LayoutService.findAll({
      company_id: data.company_id,
    }); // find company layouts

    await Promise.all(
      layouts?.map(async (layout) => {
        const settings = await generateLayoutSettingsForClone(
          layout.settings,
          company?.id
        );
        await LayoutService.create({
          ...layout,
          company_id: company._id,
          name: layout.name,
          image: layout.image,
          settings: settings,
        });
      })
    ); // clone layouts

    /** Mirror hardware clone */
    const mirrorGlassTypes = await MirrorGlassTypeService.findAll({
      company_id: data.company_id,
    }); // find company Mirror glassTypes

    await Promise.all(
      mirrorGlassTypes?.map(async (mirrorGlassType) => {
        await MirrorGlassTypeService.create({
          ...mirrorGlassType,
          company_id: company._id,
          name: mirrorGlassType.name,
          slug: mirrorGlassType.slug,
          options: mirrorGlassType.options,
        });
      })
    ); // clone Mirror glassTypes

    const mirrorEdgeWorks = await MirrorEdgeWorkService.findAll({
      company_id: data.company_id,
    }); // find company Mirror edgeWorks

    await Promise.all(
      mirrorEdgeWorks?.map(async (mirrorEdgeWork) => {
        await MirrorEdgeWorkService.create({
          ...mirrorEdgeWork,
          company_id: company._id,
          name: mirrorEdgeWork.name,
          slug: mirrorEdgeWork.slug,
          options: mirrorEdgeWork.options,
        });
      })
    ); // clone Mirror edgeWorks
    const mirrorHardwares = await MirrorHardwareService.findAll({
      company_id: data.company_id,
    }); // find company Mirror hardware

    await Promise.all(
      mirrorHardwares?.map(async (mirrorHardware) => {
        await MirrorHardwareService.create({
          ...mirrorHardware,
          company_id: company._id,
          name: mirrorHardware.name,
          slug: mirrorHardware.slug,
          options: mirrorHardware.options,
        });
      })
    ); // clone Mirror hardware
    const mirrorGlassAddons = await MirrorGlassAddonService.findAll({
      company_id: data.company_id,
    }); // find company Mirror glassAddon

    await Promise.all(
      mirrorGlassAddons?.map(async (mirrorGlassAddon) => {
        await MirrorGlassAddonService.create({
          ...mirrorGlassAddon,
          company_id: company._id,
          name: mirrorGlassAddon.name,
          slug: mirrorGlassAddon.slug,
          options: mirrorGlassAddon.options,
        });
      })
    ); // clone Mirror glassAddon
    /** end */
    /** Wine Cellar hardware clone */
    const wineCellarFinishes = await WineCellarFinishService.findAll({
      company_id: data.company_id,
    }); // find company finishes

    const wineCellarNewFinishes = await Promise.all(
      wineCellarFinishes?.map(async (finish) => {
        return await WineCellarFinishService.create({
          ...finish,
          company_id: company._id,
          slug: finish.slug,
          name: finish.name,
          image: finish.image,
        });
      })
    ); // clone finishes

    const wineCellarHardwares = await WineCellarHardwareService.findAll({
      company_id: data.company_id,
    }); // find hardwares

    await Promise.all(
      wineCellarHardwares?.map(async (hardware) => {
        const hardwareFinishes = hardware.finishes.map((finish) => {
          const finishFound = wineCellarNewFinishes.find(
            (item) => item.name === finish.name
          );
          return {
            ...finish,
            finish_id: finishFound._id,
          };
        });
        await WineCellarHardwareService.create({
          ...hardware,
          company_id: company?.id,
          finishes: hardwareFinishes,
          hardware_category_slug: hardware.hardware_category_slug,
          name: hardware.name,
          slug: hardware.slug,
        });
      })
    ); // clone hardwares

    const wineCellarGlassTypes = await WineCellarGlassTypeService.findAll({
      company_id: data.company_id,
    }); // find company glassTypes

    await Promise.all(
      wineCellarGlassTypes?.map(async (glassType) => {
        await WineCellarGlassTypeService.create({
          ...glassType,
          company_id: company._id,
          name: glassType.name,
          slug: glassType.slug,
          options: glassType.options,
        });
      })
    ); // clone glassTypes

    const wineCellarglassAddons = await WineCellarGlassAddonService.findAll({
      company_id: data.company_id,
    }); // find company glassAddons

    await Promise.all(
      wineCellarglassAddons?.map(async (glassAddon) => {
        await WineCellarGlassAddonService.create({
          ...glassAddon,
          company_id: company._id,
          name: glassAddon.name,
          slug: glassAddon.slug,
          options: glassAddon.options,
        });
      })
    ); // clone glassAddons

    const wineCellarLayouts = await WineCellarLayoutService.findAll({
      company_id: data.company_id,
    }); // find company layouts

    await Promise.all(
      wineCellarLayouts?.map(async (layout) => {
        const settings = await generateLayoutSettingsForCloneForWineCellar(
          layout.settings,
          company?.id
        );
        await WineCellarLayoutService.create({
          ...layout,
          company_id: company._id,
          name: layout.name,
          image: layout.image,
          settings: settings,
        });
      })
    ); // clone layouts
    /** end */

    handleResponse(res, 200, "Company cloned successfully", company);
  } catch (err) {
    handleError(res, err);
  }
};

const generateLayoutSettingsForClone = (settings, companyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = {};
      if (settings?.hardwareFinishes) {
        // finishes
        const oldFinish = await FinishService.findBy({
          _id: settings?.hardwareFinishes,
        });

        const newFinish = await FinishService.findBy({
          slug: oldFinish.slug,
          company_id: companyId,
        });

        result = {
          ...result,
          hardwareFinishes: newFinish._id,
        };
      }
      if (settings?.handles && settings?.handles?.handleType) {
        // handles
        const oldHandle = await HardwareService.findBy({
          _id: settings?.handles?.handleType,
        });
        const newHandle = await HardwareService.findBy({
          slug: oldHandle.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          handles: {
            handleType: newHandle._id,
            count: settings?.handles?.count,
          },
        };
      }
      if (settings?.hinges && settings?.hinges?.hingesType) {
        // hinges
        const oldHinge = await HardwareService.findBy({
          _id: settings?.hinges?.hingesType,
        });

        const newHinge = await HardwareService.findBy({
          slug: oldHinge?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          hinges: {
            hingesType: newHinge?._id,
            count: settings?.hinges?.count,
          },
        };
      }
      if (
        settings?.pivotHingeOption &&
        settings?.pivotHingeOption?.pivotHingeType
      ) {
        // pivotHingeOption
        const oldPivotHinge = await HardwareService.findBy({
          _id: settings?.pivotHingeOption?.pivotHingeType,
        });
        const newPivotHinge = await HardwareService.findBy({
          slug: oldPivotHinge?.slug,
          company_id: companyId,
        }); // crash happens here on slug
        result = {
          ...result,
          pivotHingeOption: {
            pivotHingeType: newPivotHinge?._id,
            count: settings?.pivotHingeOption?.count,
          },
        };
      }
      if (
        settings?.heavyDutyOption &&
        settings?.heavyDutyOption?.heavyDutyType
      ) {
        // heavyDutyOption
        const oldHeavyDutyType = await HardwareService.findBy({
          _id: settings?.heavyDutyOption?.heavyDutyType,
        });

        const newHeavyDutyType = await HardwareService.findBy({
          slug: oldHeavyDutyType?.slug,
          company_id: companyId,
        });

        result = {
          ...result,
          heavyDutyOption: {
            heavyDutyType: newHeavyDutyType?._id,
            threshold: settings?.heavyDutyOption?.threshold,
            height: settings?.heavyDutyOption?.height,
          },
        };
      }
      if (
        settings?.heavyPivotOption &&
        settings?.heavyPivotOption?.heavyPivotType
      ) {
        // heavyPivotOption
        const oldHeavyPivotType = await HardwareService.findBy({
          _id: settings?.heavyPivotOption?.heavyPivotType,
        });

        const newHeavyPivotType = await HardwareService.findBy({
          slug: oldHeavyPivotType?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          heavyPivotOption: {
            heavyPivotType: newHeavyPivotType?._id,
            threshold: settings?.heavyPivotOption?.threshold,
            height: settings?.heavyPivotOption?.height,
          },
        };
      }
      if (settings?.channelOrClamps) {
        // channelOrClamps
        result = { ...result, channelOrClamps: settings?.channelOrClamps };
      }
      if (settings?.mountingChannel) {
        // mountingChannel
        const oldMountingChannel = await HardwareService.findBy({
          _id: settings?.mountingChannel,
        });
        const newMountingChannel = await HardwareService.findBy({
          slug: oldMountingChannel?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          mountingChannel: newMountingChannel?._id,
        };
      }
      if (settings?.wallClamp && settings?.wallClamp?.wallClampType) {
        // wallClamp
        const oldWallClampType = await HardwareService.findBy({
          _id: settings?.wallClamp?.wallClampType,
        });
        const newWallClampType = await HardwareService.findBy({
          slug: oldWallClampType?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          wallClamp: {
            wallClampType: newWallClampType?._id,
            count: settings?.wallClamp?.count,
          },
        };
      }
      if (settings?.sleeveOver && settings?.sleeveOver?.sleeveOverType) {
        // sleeveOver
        const oldSleeveOverType = await HardwareService.findBy({
          _id: settings?.sleeveOver?.sleeveOverType,
        });
        const newSleeveOverType = await HardwareService.findBy({
          slug: oldSleeveOverType?.slug,
        });
        result = {
          ...result,
          sleeveOver: {
            sleeveOverType: newSleeveOverType?._id,
            count: settings?.sleeveOver?.count,
          },
        };
      }
      if (settings?.glassToGlass && settings?.glassToGlass?.glassToGlassType) {
        // glassToGlass
        const oldGlassToGlassType = await HardwareService.findBy({
          _id: settings?.glassToGlass?.glassToGlassType,
        });
        const newGlassToGlassType = await HardwareService.findBy({
          slug: oldGlassToGlassType?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          glassToGlass: {
            glassToGlassType: newGlassToGlassType?._id,
            count: settings?.glassToGlass?.count,
          },
        };
      }
      if (
        settings?.cornerWallClamp &&
        settings?.cornerWallClamp?.wallClampType
      ) {
        // wallClamp
        const oldWallClampType = await HardwareService.findBy({
          _id: settings?.cornerWallClamp?.wallClampType,
        });
        const newWallClampType = await HardwareService.findBy({
          slug: oldWallClampType?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          cornerWallClamp: {
            wallClampType: newWallClampType?._id,
            count: settings?.cornerWallClamp?.count,
          },
        };
      }
      if (
        settings?.cornerSleeveOver &&
        settings?.cornerSleeveOver?.sleeveOverType
      ) {
        // sleeveOver
        const oldSleeveOverType = await HardwareService.findBy({
          _id: settings?.cornerSleeveOver?.sleeveOverType,
        });
        const newSleeveOverType = await HardwareService.findBy({
          slug: oldSleeveOverType?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          cornerSleeveOver: {
            sleeveOverType: newSleeveOverType?._id,
            count: settings?.cornerSleeveOver?.count,
          },
        };
      }
      if (
        settings?.cornerGlassToGlass &&
        settings?.cornerGlassToGlass?.glassToGlassType
      ) {
        // glassToGlass
        const oldGlassToGlassType = await HardwareService.findBy({
          _id: settings?.cornerGlassToGlass?.glassToGlassType,
        });
        const newGlassToGlassType = await HardwareService.findBy({
          slug: oldGlassToGlassType?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          cornerGlassToGlass: {
            glassToGlassType: newGlassToGlassType?._id,
            count: settings?.cornerGlassToGlass?.count,
          },
        };
      }
      if (settings?.glassType && settings?.glassType?.type) {
        // glassType
        const oldGlassType = await GlassTypeService.findBy({
          _id: settings?.glassType?.type,
        });
        const newGlassType = await GlassTypeService.findBy({
          slug: oldGlassType?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          glassType: {
            type: newGlassType?._id,
            thickness: settings?.glassType?.thickness,
          },
        };
      }
      if (settings?.slidingDoorSystem && settings?.slidingDoorSystem?.type) {
        // slidingDoorSystem
        const oldSlidingDoorSystem = await HardwareService.findBy({
          _id: settings?.slidingDoorSystem?.type,
        });
        const newSlidingDoorSystem = await HardwareService.findBy({
          slug: oldSlidingDoorSystem?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          slidingDoorSystem: {
            type: newSlidingDoorSystem?._id,
            count: settings?.slidingDoorSystem?.count,
          },
        };
      }
      if (settings?.outages) {
        // outages
        result = { ...result, outages: settings?.outages };
      }
      if (settings?.notch) {
        // notch
        result = { ...result, notch: settings?.notch };
      }
      if (settings?.transom) {
        // transom
        const oldTransom = await HardwareService.findBy({
          _id: settings?.transom,
        });
        const newTransom = await HardwareService.findBy({
          slug: oldTransom?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          transom: newTransom?._id,
        };
      }
      if (settings?.header) {
        // header
        const oldHeader = await HardwareService.findBy({
          _id: settings?.header,
        });
        const newHeader = await HardwareService.findBy({
          slug: oldHeader?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          header: newHeader?._id,
        };
      }
      if (settings?.glassAddon) {
        // glassAddon
        const oldGlassAddon = await GlassAddonService.findBy({
          _id: settings?.glassAddon,
        });
        const newGlassAddon = await GlassAddonService.findBy({
          slug: oldGlassAddon?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          glassAddon: newGlassAddon?._id,
        };
      }
      // measurement Sides
      if (settings?.measurementSides) {
        result = {
          ...result,
          measurementSides: settings?.measurementSides,
        };
      }
      // variant
      if (settings?.variant) {
        result = {
          ...result,
          variant: settings?.variant,
        };
      }
      // // area by sqft formula
      // if (settings?.priceBySqftFormula) {
      //   result = {
      //     ...result,
      //     priceBySqftFormula: settings?.priceBySqftFormula,
      //   };
      // }
      // // permieter formula
      // if (settings?.perimeterFormula) {
      //   result = {
      //     ...result,
      //     perimeterFormula: settings?.perimeterFormula,
      //   };
      // }
      if (settings?.other) {
        // other
        result = {
          ...result,
          other: {
            people: settings?.other?.people,
            hours: settings?.other?.hours,
          },
        };
      }
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const generateLayoutSettingsForCloneForWineCellar = (settings, companyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = {};
      if (settings?.hardwareFinishes) {
        // finishes
        const oldFinish = await WineCellarFinishService.findBy({
          _id: settings?.hardwareFinishes,
        });

        const newFinish = await WineCellarFinishService.findBy({
          slug: oldFinish.slug,
          company_id: companyId,
        });

        result = {
          ...result,
          hardwareFinishes: newFinish._id,
        };
      }
      if (settings?.handles && settings?.handles?.handleType) {
        // handles
        const oldHandle = await WineCellarHardwareService.findBy({
          _id: settings?.handles?.handleType,
        });
        const newHandle = await WineCellarHardwareService.findBy({
          slug: oldHandle.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          handles: {
            handleType: newHandle._id,
            count: settings?.handles?.count,
          },
        };
      }
      if (settings?.doorLock && settings?.doorLock?.type) {
        // doorLock
        const oldDoorLock = await WineCellarHardwareService.findBy({
          _id: settings?.doorLock?.type,
        });
        const newDoorLock = await WineCellarHardwareService.findBy({
          slug: oldDoorLock?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          doorLock: {
            type: newDoorLock?._id,
            count: settings?.doorLock?.count,
          },
        };
      }
      if (settings?.hinges && settings?.hinges?.hingesType) {
        // hinges
        const oldHinge = await WineCellarHardwareService.findBy({
          _id: settings?.hinges?.hingesType,
        });

        const newHinge = await WineCellarHardwareService.findBy({
          slug: oldHinge?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          hinges: {
            hingesType: newHinge?._id,
            count: settings?.hinges?.count,
          },
        };
      }
      if (
        settings?.heavyDutyOption &&
        settings?.heavyDutyOption?.heavyDutyType
      ) {
        // heavyDutyOption
        const oldHeavyDutyType = await WineCellarHardwareService.findBy({
          _id: settings?.heavyDutyOption?.heavyDutyType,
        });

        const newHeavyDutyType = await WineCellarHardwareService.findBy({
          slug: oldHeavyDutyType?.slug,
          company_id: companyId,
        });

        result = {
          ...result,
          heavyDutyOption: {
            heavyDutyType: newHeavyDutyType?._id,
            threshold: settings?.heavyDutyOption?.threshold,
            height: settings?.heavyDutyOption?.height,
          },
        };
      }
      if (settings?.channelOrClamps) {
        // channelOrClamps
        result = { ...result, channelOrClamps: settings?.channelOrClamps };
      }
      if (settings?.mountingChannel) {
        // mountingChannel
        const oldMountingChannel = await WineCellarHardwareService.findBy({
          _id: settings?.mountingChannel,
        });
        const newMountingChannel = await WineCellarHardwareService.findBy({
          slug: oldMountingChannel?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          mountingChannel: newMountingChannel?._id,
        };
      }
      if (settings?.glassType && settings?.glassType?.type) {
        // glassType
        const oldGlassType = await WineCellarGlassTypeService.findBy({
          _id: settings?.glassType?.type,
        });
        const newGlassType = await WineCellarGlassTypeService.findBy({
          slug: oldGlassType?.slug,
          company_id: companyId,
        });
        result = {
          ...result,
          glassType: {
            type: newGlassType?._id,
            thickness: settings?.glassType?.thickness,
          },
        };
      }
      if (settings?.glassAddon) {
        // glassAddon
        // const oldGlassAddon = await GlassAddonService.findBy({
        //   _id: settings?.glassAddon,
        // });
        // const newGlassAddon = await GlassAddonService.findBy({
        //   slug: oldGlassAddon?.slug,
        //   company_id: companyId,
        // });
        // result = {
        //   ...result,
        //   glassAddon: newGlassAddon?._id,
        // };
      }
      // measurement Sides
      if (settings?.measurementSides) {
        result = {
          ...result,
          measurementSides: settings?.measurementSides,
        };
      }
      // noOfHoursToCompleteSingleDoor
      if (settings?.noOfHoursToCompleteSingleDoor) {
        result = {
          ...result,
          noOfHoursToCompleteSingleDoor:
            settings?.noOfHoursToCompleteSingleDoor,
        };
      }
      // variant
      if (settings?.variant) {
        result = {
          ...result,
          variant: settings?.variant,
        };
      }
      if (settings?.other) {
        // other
        result = {
          ...result,
          other: {
            people: settings?.other?.people,
            hours: settings?.other?.hours,
          },
        };
      }
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

exports.modifyExistingRecords = async (req, res) => {
  try {
    const result = await CompanyService.updateMany(
      {
        $or: [
          { "showers.glassTypesForComparison": { $exists: false } },
          { "mirrors.glassTypesForComparison": { $exists: false } },
          { "wineCellars.glassTypesForComparison": { $exists: false } },
          { highlevelSettings: { $exists: false } },
        ],
      },
      {
        $set: {
          "showers.glassTypesForComparison": [],
          "mirrors.glassTypesForComparison": [],
          "wineCellars.glassTypesForComparison": [],
          highlevelSettings: { locationReference: "", apiKey: "" },
        },
      }
    );

    handleResponse(res, 200, "Companies info updated", result);
  } catch (err) {
    handleError(res, err);
  }
};