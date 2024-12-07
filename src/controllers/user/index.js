const mongoose = require("mongoose");
const CompanyService = require("../../services/company");
const UserService = require("../../services/user");
const {
  generateRandomString,
  isEmailAlreadyUsed,
} = require("../../utils/common");
const { handleResponse, handleError } = require("../../utils/responses");
const { finishes } = require("../../seeders/finishesSeeder");
const { hardwares } = require("../../seeders/hardwaresSeeder");
const {
  hardwareCategories,
} = require("../../seeders/hardwareCategoriesSeeder");
const { layouts } = require("../../seeders/layoutsSeeder");
const MailgunService = require("../../services/mailgun");
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
const {
  userCreatedTemplate,
  passwordUpdatedTemplate,
  userNotActiveTemplate,
} = require("../../templates/email");
// const CustomUserService = require("../../services/customUser");
const { multerSource, multerActions } = require("../../config/common");
const { addOrUpdateOrDelete } = require("../../services/multer");
const { mirrorGlassTypes } = require("@seeders/mirrorGlassTypeSeeder");
const MirrorGlassTypeService = require("@services/mirror/glassType");
const { mirrorEdgeWork } = require("@seeders/mirrorEdgeWorkSeeder");
const MirrorEdgeWorkService = require("@services/mirror/edgeWork");
const ProjectService = require("@services/project");
const {estimateCategory} = require("@config/common");
const {generateLayoutSettings, generateLayoutSettingsForWineCellar} = require("@utils/generateFormats");
const {mirrorHardwares} = require("@seeders/mirrorHardwareSeeder");
const MirrorHardwareService = require("@services/mirror/hardware");
const MirrorGlassAddonService = require("@services/mirror/glassAddon");
const {mirrorGlassAddons} = require("@seeders/mirrorGlassAddonSeeder");
const WineCellarHardwareCategoryService = require("@services/wineCellar/hardwareCategory");
const {wineCellarHardwareCategories} = require("@seeders/wineCellarHardwareCategoriesSeeder");
const {wineCellarFinishes} = require("@seeders/wineCellarFinishSeeder");
const WineCellarFinishService = require("@services/wineCellar/finish");
const {wineCellarHardware} = require("@seeders/wineCellarHardwareSeeder");
const WineCellarHardwareService = require("@services/wineCellar/hardware");
const {wineCellarGlassTypes} = require("@seeders/wineCellarGlassTypeSeeder");
const WineCellarGlassTypeService = require("@services/wineCellar/glassType");
const {wineCellarLayouts} = require("@seeders/wineCellarLayoutSeeder");
const WineCellarLayoutService = require("@services/wineCellar/layout");
const { wineCellarGlassAddons } = require("@seeders/wineCellarGlassAddonsSeeder");
const WineCellarGlassAddonService = require("@services/wineCellar/glassAddon");
exports.getAll = async (req, res) => {
  try {
    // const companies = await CompanyService.findAll();
    // const estimates = await EstimateService.findAll();
    // const customers = await CustomerService.findAll();
    // const staffs = await StaffService.findAll();
    // const layouts = await LayoutService.findAll();
    // const users = await UserService.findAll();
    // let results = [];
    // results = await Promise.all(
    //   companies?.map(async(company) => {
    //     const companyEstimates = await estimates?.filter(item => item.company_id.toString() === company.id);
    //     const companyCustomers = await customers?.filter(item => item.company_id.toString() === company.id );
    //     const companyStaffs = await staffs?.filter(item => item.company_id.toString() === company.id || item?.haveAccessTo?.includes(company.id));
    //     const companyLayouts = await layouts?.filter(item => item.company_id.toString() === company.id);
    //     const user = await users?.find( item => item.id === company.user_id.toString());
    //     return {
    //       company: company,
    //       user: user,
    //       estimates: companyEstimates?.length || 0,
    //       customers: companyCustomers?.length || 0,
    //       staffs: companyStaffs?.length || 0,
    //       layouts: companyLayouts?.length || 0,
    //     };
    //   })
    // );
    const resp = await UserService.findAllWithRelativeLocation({});
    handleResponse(res, 200, "All Locations", resp);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getDashboardTotals = async (req, res) => {
  const company_id = req.user.company_id;
  try {
    const estimates = await EstimateService.count({ company_id: company_id });
    const customers = await CustomerService.count({ company_id: company_id });
    const staffs = await StaffService.count({
      $or: [
        { company_id: company_id },
        { haveAccessTo: { $in: [company_id] } },
      ],
    });
    handleResponse(res, 200, "Dashboard Data", {
      estimates: estimates || 0,
      customers: customers || 0,
      staff: staffs || 0,
    });
  } catch (error) {
    handleError(res, error);
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
    if (!oldUser) {
      throw new Error("Invalid user ID");
    }
    const oldCompany = await CompanyService.findBy({ user_id: id });
    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.COMPANIES,
        req.file.filename,
        oldCompany.image
      );
    }

    await UserService.update({_id:id},{name:data?.name}); // update user
    const company = await CompanyService.update({user_id: id},{
      name: data?.locationName,
      image: data?.image !== 'null' ? data?.image : 'images/others/company_default.jpg',
      address: data?.locationAddress
    }); // update user company

    handleResponse(res, 200, "Location info updated successfully", company);
  } catch (err) {
    handleError(res, err);
  }
};
exports.updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const password = generateRandomString(8);
  try {
    const oldUser = await UserService.findBy({ _id: id });
    if (!oldUser) {
      throw new Error("Invalid user ID");
    }
    const user = await UserService.update({ _id: id }, { password: password });
    // Sending an email to the user
    const html = passwordUpdatedTemplate(password);
    await MailgunService.sendEmail(user.email, "Password Updated", html);
    handleResponse(res, 200, "User Password updated successfully", user);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  const oldUser = await UserService.findBy({ _id: id });

  if (!data?.status) {
    const html = userNotActiveTemplate("Your Location is Not Active now");
    await MailgunService.sendEmail(oldUser.email, "Account Disabled", html);
  }

  UserService.update({ _id: id }, { status: data?.status })
    .then((user) => {
      handleResponse(res, 200, "Location status updated successfully", user);
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
      throw new Error("Invalid user ID");
    }
    const company = await CompanyService.findBy({ user_id: user._id });
    if (!company) {
      throw new Error("No Company attached to this user");
    }
    if (user && user.image && user.image.startsWith("images/users/uploads")) {
      await addOrUpdateOrDelete(
        multerActions.DELETE,
        multerSource.USERS,
        user.image
      );
    }
    if (company && company.image && company.image.startsWith("images/companies/uploads")) {
      await addOrUpdateOrDelete(
        multerActions.DELETE,
        multerSource.COMPANIES,
        company.image
      );
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
    // Delete Projects
    await ProjectService.deleteAll({ company_id: company._id });
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
    // Delete Mirror Hardwares
    await MirrorHardwareService.deleteAll({ company_id: company._id });
    // Delete Mirror Edge works
    await MirrorEdgeWorkService.deleteAll({ company_id: company._id });
    // Delete Mirror Glass Types
    await MirrorGlassTypeService.deleteAll({ company_id: company._id });
    // Delete Mirror Glass Addons
    await MirrorGlassAddonService.deleteAll({ company_id: company._id });
    // Delete Wine Cellar Hardwares
    await WineCellarHardwareService.deleteAll({ company_id: company._id });
    // Delete Wine Cellar Glass Types
    await WineCellarGlassTypeService.deleteAll({ company_id: company._id });
    // Delete Wine Cellar Glass Addons
    await WineCellarGlassAddonService.deleteAll({ company_id: company._id });
    // Delete Wine Cellar Finishes
    await WineCellarFinishService.deleteAll({ company_id: company._id });
    // Delete Wine Cellar Layouts
    await WineCellarLayoutService.deleteAll({ company_id: company._id });
    // Delete Company record
    await CompanyService.delete({ _id: company._id });
    // Delete Company user
    await UserService.delete({ _id: user._id });

    handleResponse(res, 200, "Location deleted successfully", user);
  } catch (err) {
    handleError(res, err);
  }
};
exports.saveUser = async (req, res) => {
  const password = generateRandomString(8);
  const data = { ...req.body, password: password };

  try {
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
      throw new Error("Email already exist in system.Please try with new one.");
    }

    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.SAVE,
        multerSource.COMPANIES,
        req.file.path
      );
    }

    const hardwareCat = await HardwareCategoryService.findAll();
    if (hardwareCat?.length <= 0) {
      await Promise.all(
        hardwareCategories?.map(async (cat) => {
          await HardwareCategoryService.create({ ...cat });
        })
      );
    }
    const user = await UserService.create({...data,image:"images/users/default.jpg"}); // create user
    const company = await CompanyService.create({
      user_id: user?.id,
      name: data?.locationName,
      image: data?.image !== 'null' ? data?.image : 'images/others/company_default.jpg',
      address: data?.locationAddress
    }); // create user company
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
      // create user hardware
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
    await seedLayouts(layouts, company?.id,estimateCategory.SHOWERS); // create user layouts
    /** Mirror hardware **/
    mirrorGlassTypes?.map(async (glassType) => {
      // create user glass types for mirror layouts
      await MirrorGlassTypeService.create({
        ...glassType,
        company_id: company?.id,
      });
    });
    mirrorEdgeWork?.map(async (edgeWork) => {
      // create user edge works for mirror layouts
      await MirrorEdgeWorkService.create({
        ...edgeWork,
        company_id: company?.id,
      });
    });
    mirrorHardwares?.map(async (hardware) => {
      // create user edge works for mirror layouts
      await MirrorHardwareService.create({
        ...hardware,
        company_id: company?.id,
      });
    });
    mirrorGlassAddons?.map(async (glassAddon) => {
      // create user edge works for mirror layouts
      await MirrorGlassAddonService.create({
        ...glassAddon,
        company_id: company?.id,
      });
    });
    /** end **/
    /** WineCellar Hardware **/
    const wineCellarHardwareCat = await WineCellarHardwareCategoryService.findAll();
    if (wineCellarHardwareCat?.length <= 0) { // hardware categories add
      await Promise.all(
          wineCellarHardwareCategories?.map(async (cat) => {
            await WineCellarHardwareCategoryService.create({ ...cat });
          })
      );
    }
    await Promise.all(  // finishes add
        wineCellarFinishes?.map(async (finish) => {
          await WineCellarFinishService.create({ ...finish, company_id: company?.id }); // create company finishes
        })
    );
    const userFinishesWineCellar = await WineCellarFinishService.findAll({
      company_id: company?.id,
    }); // get all finishes

    wineCellarHardware?.map(async (hardware) => {
      const finishes = hardware?.finishes?.map((hardwareFinish) => {
        const finish = userFinishesWineCellar?.find(
            (item) => item?.slug === hardwareFinish?.finish_id
        );
        return { ...hardwareFinish, finish_id: finish._id };
      });
      // create user hardware for wine cellar
      await WineCellarHardwareService.create({
        ...hardware,
        company_id: company?.id,
        finishes: finishes,
      });
    });
    wineCellarGlassTypes?.map(async (glassType) => {
      // create user glass types
      await WineCellarGlassTypeService.create({ ...glassType, company_id: company?.id });
    });
    await seedLayouts(wineCellarLayouts, company?.id,estimateCategory.WINECELLARS); // create user layouts
    /** end **/
    wineCellarGlassAddons?.map(async (glassAddon) => {
      // create user glass treatments
      await WineCellarGlassAddonService.create({
        ...glassAddon,
        company_id: company?.id,
      });
    });
    // Sending an email to the user
    const html = userCreatedTemplate(password);

    await MailgunService.sendEmail(data.email, "Account Created", html);

    handleResponse(res, 200, "Location created successfully", user);
  } catch (error) {
    console.log(error);
    handleError(res, error);
  }
};

const seedLayouts = (layouts, company_id, type) => {
  return new Promise((resolve, reject) => {
    try {
      const result = [];
      layouts?.map(async (layout) => {
        let settings = {};
        if(type === estimateCategory.SHOWERS){
          settings = await generateLayoutSettings(
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
        }
        else if (type === estimateCategory.WINECELLARS){
          settings = await generateLayoutSettingsForWineCellar(
              layout?.settings,
              company_id
          );
          result.push(
            await WineCellarLayoutService.create({
              name: layout?.name,
              image: layout?.image,
              company_id: new mongoose.Types.ObjectId(company_id),
              settings: { ...settings },
            })
          );
        }
      });
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};