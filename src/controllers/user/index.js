const mongoose = require("mongoose");
const CompanyService = require("../../services/company");
const UserService = require("../../services/user");
const { generateRandomString } = require("../../utils/common");
const { handleResponse, handleError } = require("../../utils/responses");
const { finishes } = require("../../seeders/finishesSeeder");
const { hardwares } = require("../../seeders/hardwaresSeeder");
const {
  hardwareCategories,
} = require("../../seeders/hardwareCategoriesSeeder");
const { layouts } = require("../../seeders/layoutsSeeder");
const MailgunService = require("../../services/sendMail/index");
const { glassTypes } = require("../../seeders/glassTypeSeeder");
const { glassAddons } = require("../../seeders/glassAddonsSeeder");

const FinishService = require("../../services/finish");
const HardwareService = require("../../services/hardware");
const HardwareCategoryService = require("../../services/hardwareCategory");
const LayoutService = require("../../services/layout");
const GlassTypeService = require("../../services/glassType");
const GlassAddonService = require("../../services/glassAddon");
const EstimateService = require("../../services/estimate");
const CustomerService = require("../../services/customer");
const StaffService = require("../../services/staff");
const { userCreated } = require("../../templates/email");
const CustomUserService = require("../../services/customUser");

exports.getAll = async (req, res) => {
  try {
    const companies = await CompanyService.findAll();
    const result = await Promise.all(
      companies.map(async (company) => {
        const estimates = await EstimateService.findAll({
          company_id: company._id,
        });
        const customers = await CustomerService.findAll({
          company_id: company._id,
        });
        const staffs = await StaffService.findAll({
          company_id: company._id,
        });
        const layouts = await LayoutService.findAll({
          company_id: company._id,
        });
        const user = await UserService.findBy({ _id: company.user_id });
        return {
          user: user,
          estimates: estimates?.length || 0,
          customers: customers?.length || 0,
          staffs: staffs?.length || 0,
          layouts: layouts?.length || 0,
        };
      })
    );
    handleResponse(res, 200, "All Locations", result);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getDashboardTotals = async (req, res) => {
  const company_id = req.company_id;
  try {
    const estimates = await EstimateService.findAll({ company_id: company_id });
    const customers = await CustomerService.findAll({ company_id: company_id });
    const staff = await StaffService.findAll({ company_id: company_id });
    handleResponse(res, 200, "Dashboard Data", {
      estimates: estimates.length,
      customers: customers.length,
      staff: staff.length,
    });
  } catch (error) {
    handleError(res, error);
  }
};
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserService.findBy({ email: email });
        if (!user) {
      handleError(res, { statusCode: 400, message: "Incorrect Email address" });
    } else if (!user.comparePassword(password)) {
      handleError(res, { statusCode: 400, message: "Incorrect Credentials" });
    } else if (user.comparePassword(password) && !user.status) {
      handleError(res, { statusCode: 400, message: "User is not active" });
    } else {
      const company = await CompanyService.findBy({ user_id: user._id });
      if (!company) {
        handleError(res, {
          statusCode: 400,
          message: "No Company is registered against this email!",
        });
      }
      const token = await user.generateJwt(company._id);
      handleResponse(res, 200, "You are successfully logged in!", { token });
    }
  } catch (err) {
    handleError(res, err);
  }
};
exports.getUser = async (req, res) => {
  const { id } = req.params;
  UserService.findBy({ _id: id })
    .then((user) => {
      handleResponse(res, 200, "Success", user);
    })
    .catch((err) => {
      handleError(res, err);
    });
};
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  try {
    const oldUser = await UserService.findBy({ _id: id });

    if (req.file) {
      const newImagePath = `images/newUsers/${req.file.filename}`;

      if (oldUser && oldUser.image) {
        const oldImagePath = `public/${oldUser.image}`;
        if (oldUser.image.startsWith("images/newUsers")) {
          fs.unlinkSync(oldImagePath);
          data.image = newImagePath;
        } else {
          data.image = newImagePath;
        }
      } else {
        data.image = newImagePath;
      }
    }
    const user = await UserService.update({ _id: id }, data);
    handleResponse(res, 200, "User info updated successfully", user);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  UserService.update({ _id: id }, { status: data?.status })
    .then((user) => {
      handleResponse(res, 200, "User status updated successfully", user);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserService.findBy({ _id: id });
    if (!user) {
      handleError(res, { statusCode: 400, message: "Invalid user ID" });
    }
    const company = await CompanyService.findBy({ user_id: user._id });
    if (!company) {
      handleError(res, {
        statusCode: 400,
        message: "No Company attached to this user",
      });
    }
    const allStaff = await StaffService.findAll();
    // remove company id from haveAccessTo array of Staff members
    await Promise.all(
      allStaff?.map(async (staff) => {
        const staffAccess = staff.haveAccessTo;
        const array = staffAccess.filter((item) => !item.equals(company._id));
        await StaffService.update(
          { _id: staff._id },
          { haveAccessTo: [...array] }
        );
      })
    );

    // Delete Staff of company
    await StaffService.deleteAll({ company_id: company._id });
    // Delete Estimates
    await EstimateService.deleteAll({ company_id: company._id });
    // Delete Customers
    await CustomerService.deleteAll({ company_id: company._id });
    // Delete Finishes
    await FinishService.deleteAll({ company_id: company._id });
    // Delete Glass Addons
    await GlassAddonService.deleteAll({ company_id: company._id });
    // Delete Glass Types
    await GlassTypeService.deleteAll({ company_id: company._id });
    // Delete Hardwares
    await HardwareService.deleteAll({ company_id: company._id });
    // Delete Layouts
    await LayoutService.deleteAll({ company_id: company._id });
    // Delete Company record
    await CompanyService.delete({ _id: company._id });
    // Delete Company user
    await UserService.delete({ _id: user._id });

    handleResponse(res, 200, "User deleted successfully", user);
  } catch (err) {
    handleError(res, err);
  }
};
exports.saveUser = async (req, res) => {
  const password = generateRandomString(8);
  const data = { ...req.body, password: password };

  try {
    const hardwareCat = await HardwareCategoryService.findAll();
    if (hardwareCat?.length <= 0) {
      await Promise.all(
        hardwareCategories?.map(async (cat) => {
          await HardwareCategoryService.create({ ...cat });
        })
      );
    }
    const user = await UserService.create(data); // create user
    const company = await CompanyService.create({ user_id: user?.id }); // create user company
    await Promise.all(
      finishes?.map(async (finish) => {
        await FinishService.create({ ...finish, company_id: company?.id }); // create company finishes
      })
    );
    const userFinishes = await FinishService.findAll({
      company_id: company?.id,
    }); // get all finishes

    // const hardwareFinishes = await this.generateFinishes(userFinishes);
    hardwares?.map(async (hardware) => {
      const finishes = hardware?.finishes?.map((hardwareFinish) => {
        const finish = userFinishes?.find(
          (item) => item?.slug === hardwareFinish?.finish_id
        );
        return { ...hardwareFinish, finish_id: finish._id };
      });
      // create user hardwares
      await HardwareService.create({
        ...hardware,
        company_id: company?.id,
        finishes: finishes,
      });
    });
    glassTypes?.map(async (glassType) => {
      // create user glass types
      await GlassTypeService.create({ ...glassType, company_id: company?.id });
    });
    glassAddons?.map(async (glassAddon) => {
      // create user glass treatments
      await GlassAddonService.create({
        ...glassAddon,
        company_id: company?.id,
      });
    });
    await seedLayouts(layouts, company?.id); // create user layouts

    // Sending an email to the user
    const html = userCreated(password);

    await MailgunService.sendEmail(data.email, "Account Created", html);

    handleResponse(res, 200, "User created successfully", user);
  } catch (error) {
    console.log(error);
    handleError(res, error);
  }
};

const seedLayouts = (layouts, company_id) => {
  return new Promise((resolve, reject) => {
    try {
      const result = [];
      layouts?.map(async (layout) => {
        const settings = await generateLayoutSettings(
          layout?.settings,
          company_id
        );
        result.push(
          await LayoutService.create({
            name: layout?.name,
            image: layout?.image,
            company_id: new mongoose.Types.ObjectId(company_id),
            settings: { ...settings },
          })
        );
      });
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
const generateLayoutSettings = (settings, companyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = {};
      if (settings?.hardwareFinishes) {
        // finishes
        const finish = await FinishService.findBy({
          slug: settings?.hardwareFinishes,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          hardwareFinishes: finish._id,
        };
      }
      if (settings?.handles && settings?.handles?.handleType) {
        // handles
        const handle = await HardwareService.findBy({
          slug: settings?.handles?.handleType,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          handles: {
            handleType: new mongoose.Types.ObjectId(handle.id),
            count: settings?.handles?.count,
          },
        };
      }
      if (settings?.hinges && settings?.hinges?.hingesType) {
        // hinges
        const hinge = await HardwareService.findBy({
          slug: settings?.hinges?.hingesType,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          hinges: {
            hingesType: new mongoose.Types.ObjectId(hinge?.id),
            count: settings?.hinges?.count,
          },
        };
      }
      if (
        settings?.pivotHingeOption &&
        settings?.pivotHingeOption?.pivotHingeType
      ) {
        // pivotHingeOption
        const pivotHinge = await HardwareService.findBy({
          slug: settings?.pivotHingeOption?.pivotHingeType,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          pivotHingeOption: {
            pivotHingeType: new mongoose.Types.ObjectId(pivotHinge?.id),
            count: settings?.pivotHingeOption?.count,
          },
        };
      }
      if (
        settings?.heavyDutyOption &&
        settings?.heavyDutyOption?.heavyDutyType
      ) {
        // heavyDutyOption
        const heavyDutyType = await HardwareService.findBy({
          slug: settings?.heavyDutyOption?.heavyDutyType,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          heavyDutyOption: {
            heavyDutyType: new mongoose.Types.ObjectId(heavyDutyType?.id),
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
        const heavyPivotType = await HardwareService.findBy({
          slug: settings?.heavyPivotOption?.heavyPivotType,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          heavyPivotOption: {
            heavyPivotType: new mongoose.Types.ObjectId(heavyPivotType?.id),
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
        const mountingChannel = await HardwareService.findBy({
          slug: settings?.mountingChannel,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          mountingChannel: new mongoose.Types.ObjectId(mountingChannel?.id),
        };
      }
      if (settings?.wallClamp && settings?.wallClamp?.wallClampType) {
        // wallClamp
        const wallClampType = await HardwareService.findBy({
          slug: settings?.wallClamp?.wallClampType,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          wallClamp: {
            wallClampType: new mongoose.Types.ObjectId(wallClampType?.id),
            count: settings?.wallClamp?.count,
          },
        };
      }
      if (settings?.sleeveOver && settings?.sleeveOver?.sleeveOverType) {
        // sleeveOver
        const sleeveOverType = await HardwareService.findBy({
          slug: settings?.sleeveOver?.sleeveOverType,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          sleeveOver: {
            sleeveOverType: new mongoose.Types.ObjectId(sleeveOverType?.id),
            count: settings?.sleeveOver?.count,
          },
        };
      }
      if (settings?.glassToGlass && settings?.glassToGlass?.glassToGlassType) {
        // glassToGlass
        const glassToGlassType = await HardwareService.findBy({
          slug: settings?.glassToGlass?.glassToGlassType,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          glassToGlass: {
            glassToGlassType: new mongoose.Types.ObjectId(glassToGlassType?.id),
            count: settings?.glassToGlass?.count,
          },
        };
      }
      if (
        settings?.cornerWallClamp &&
        settings?.cornerWallClamp?.wallClampType
      ) {
        // wallClamp
        const wallClampType = await HardwareService.findBy({
          slug: settings?.cornerWallClamp?.wallClampType,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          cornerWallClamp: {
            wallClampType: new mongoose.Types.ObjectId(wallClampType?.id),
            count: settings?.cornerWallClamp?.count,
          },
        };
      }
      if (
        settings?.cornerSleeveOver &&
        settings?.cornerSleeveOver?.sleeveOverType
      ) {
        // sleeveOver
        const sleeveOverType = await HardwareService.findBy({
          slug: settings?.cornerSleeveOver?.sleeveOverType,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          cornerSleeveOver: {
            sleeveOverType: new mongoose.Types.ObjectId(sleeveOverType?.id),
            count: settings?.cornerSleeveOver?.count,
          },
        };
      }
      if (
        settings?.cornerGlassToGlass &&
        settings?.cornerGlassToGlass?.glassToGlassType
      ) {
        // glassToGlass
        const glassToGlassType = await HardwareService.findBy({
          slug: settings?.cornerGlassToGlass?.glassToGlassType,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          cornerGlassToGlass: {
            glassToGlassType: new mongoose.Types.ObjectId(glassToGlassType?.id),
            count: settings?.cornerGlassToGlass?.count,
          },
        };
      }
      if (settings?.glassType && settings?.glassType?.type) {
        // glassType
        const glassType = await GlassTypeService.findBy({
          slug: settings?.glassType?.type,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          glassType: {
            type: new mongoose.Types.ObjectId(glassType?.id),
            thickness: settings?.glassType?.thickness,
          },
        };
      }
      if (settings?.slidingDoorSystem && settings?.slidingDoorSystem?.type) {
        // slidingDoorSystem
        const slidingDoorSystem = await HardwareService.findBy({
          slug: settings?.slidingDoorSystem?.type,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          slidingDoorSystem: {
            type: new mongoose.Types.ObjectId(slidingDoorSystem?.id),
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
        const transom = await HardwareService.findBy({
          slug: settings?.transom,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          transom: new mongoose.Types.ObjectId(transom?.id),
        };
      }
      if (settings?.header) {
        // header
        const header = await HardwareService.findBy({
          slug: settings?.header,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          header: new mongoose.Types.ObjectId(header?.id),
        };
      }
      if (settings?.glassAddon) {
        // glassAddon
        const glassAddon = await GlassAddonService.findBy({
          slug: settings?.glassAddon,
          company_id: new mongoose.Types.ObjectId(companyId),
        });
        result = {
          ...result,
          glassAddon: new mongoose.Types.ObjectId(glassAddon?.id),
        };
      }
      // measurement Sides
      if (settings?.measurementSides) {
        result = {
          ...result,
          measurementSides: settings?.measurementSides,
        };
      }
      // measurement Sides
      if (settings?.variant) {
        result = {
          ...result,
          variant: settings?.variant,
        };
      }
      // area by sqft formula
      if (settings?.priceBySqftFormula) {
        result = {
          ...result,
          priceBySqftFormula: settings?.priceBySqftFormula,
        };
      }
      // permieter formula
      if (settings?.perimeterFormula) {
        result = {
          ...result,
          perimeterFormula: settings?.perimeterFormula,
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
          holesNeeded: finish?.holesNeeded,
          cost: finish?.cost,
          status: "false",
          finish_id: finish?.id,
        },
      ]);
      resolve(hardwareFinishes);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getQuote = async (req, res) => {
  const { id } = req.params;
  try {
    const estimates = await EstimateService.findAll({ customer_id: id });
    handleResponse(res, 200, "Dashboard Data", estimates);
  } catch (error) {
    handleError(res, error);
  }
};
