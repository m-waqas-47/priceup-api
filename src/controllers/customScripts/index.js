const { glassAddons } = require("@seeders/glassAddonsSeeder");
const { glassTypes } = require("@seeders/glassTypeSeeder");
const { hardwareCategories } = require("@seeders/hardwareCategoriesSeeder");
const { hardwares } = require("@seeders/hardwaresSeeder");
const CompanyService = require("@services/company");
const WineCellarFinishService = require("@services/wineCellar/finish");
const WineCellarGlassAddonService = require("@services/wineCellar/glassAddon");
const WineCellarGlassTypeService = require("@services/wineCellar/glassType");
const WineCellarHardwareService = require("@services/wineCellar/hardware");
const WineCellarHardwareCategoryService = require("@services/wineCellar/hardwareCategory");
const { handleError, handleResponse } = require("@utils/responses");

exports.runCustomScripts = async (req, res) => {
  try {
    hardwareCategories.forEach(async (category) => {
      await WineCellarHardwareCategoryService.update(
        { slug: category.slug }, // Condition to check if slug already exists
        { $set: category }, // Updates the document if found or inserts it
        { upsert: true } // Ensures insertion if the document doesn't exist
      );
    });

    const companies = await CompanyService.findAll({});
    await Promise.all(
      companies.map(async (company) => {
        // Get all finishes for the current company
        const companyFinishes = await WineCellarFinishService.findAll({
          company_id: company._id,
        });
    
        // Prepare new hardware data for the company
        const companyNewHardwares = await Promise.all(
          hardwares.map(async (hardware) => {
            const finishes = hardware.finishes.map((hardwareFinish) => {
              const finish = companyFinishes.find(
                (item) => item?.slug === hardwareFinish?.finish_id
              );
              return { ...hardwareFinish, finish_id: finish?._id };
            });
            return { ...hardware, finishes };
          })
        );
    
        // Perform updates for glassTypes, glassAddons, and hardware
        await Promise.all([
          ...glassTypes.map((glassType) =>
            WineCellarGlassTypeService.update(
              { slug: glassType.slug, company_id: company._id },
              { $set: { ...glassType, company_id: company._id } },
              { upsert: true }
            )
          ),
          ...glassAddons.map((glassAddon) =>
            WineCellarGlassAddonService.update(
              { slug: glassAddon.slug, company_id: company._id },
              { $set: { ...glassAddon, company_id: company._id } },
              { upsert: true }
            )
          ),
          ...companyNewHardwares.map((hardware) =>
            WineCellarHardwareService.update(
              { slug: hardware.slug, company_id: company._id },
              { $set: { ...hardware, company_id: company._id } },
              { upsert: true }
            )
          ),
        ]);
      })
    );
    

    const result = await WineCellarHardwareService.updateMany(
      {
        "fabrication.clampCut": { $exists: false },
        "fabrication.notch": { $exists: false },
        "fabrication.outages": { $exists: false },
      },
      {
        $set: {
          "fabrication.clampCut": 0,
          "fabrication.notch": 0,
          "fabrication.outages": 0,
        },
      }
    );
    handleResponse(res, 200, "Success", result);
  } catch (err) {
    handleError(res, err);
  }
};
