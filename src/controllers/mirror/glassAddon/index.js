const MirrorGlassAddonService = require("@services/mirror/glassAddon");
const { nestedObjectsToDotNotation } = require("@utils/common");
const { handleResponse, handleError } = require("@utils/responses");
const { addOrUpdateOrDelete } = require("@services/multer");
const { multerActions, multerSource } = require("@config/common");
const CompanyService = require("@services/company");
const { mirrorGlassAddons } = require("@seeders/mirrorGlassAddonSeeder");
const entityType = "Glass Addon";
exports.getAll = async (req, res) => {
  const company_id = req.user.company_id;
  MirrorGlassAddonService.findAll({ company_id: company_id })
    .then((records) => {
      handleResponse(res, 200, `All ${entityType}s`, records);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.get = async (req, res) => {
  const { id } = req.params;
  MirrorGlassAddonService.findBy({ _id: id })
    .then((record) => {
      handleResponse(res, 200, "Success", record);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteOptions = async (req, res) => {
  const { id, optionId } = req.params;
  MirrorGlassAddonService.update(
    { _id: id },
    { $pull: { options: { _id: optionId } } }
  )
    .then((record) => {
      handleResponse(
        res,
        200,
        `${entityType} options removed successfully`,
        record
      );
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.addOptions = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  MirrorGlassAddonService.update({ _id: id }, { $push: { options: data } })
    .then((record) => {
      handleResponse(
        res,
        200,
        `${entityType} options added successfully`,
        record
      );
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteEntity = async (req, res) => {
  const { id } = req.params;
  MirrorGlassAddonService.delete({ _id: id })
    .then((record) => {
      handleResponse(res, 200, `${entityType} deleted successfully`, record);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.save = async (req, res) => {
  const data = { ...req.body };
  const company_id = req.user.company_id;

  try {
    const oldRecord = await MirrorGlassAddonService.findBy({
      slug: data.slug,
      company_id: company_id,
    });

    if (oldRecord) {
      throw new Error(
        `${entityType} with exact name already exist. Please name it to something else.`
      );
    }
    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.SAVE,
        multerSource.MIRRORGLASSADDONS,
        req.file.path
      );
    }

    const options = await generateOptions();
    const record = await MirrorGlassAddonService.create({
      ...data,
      options: options,
    });
    handleResponse(res, 200, `${entityType} created successfully`, record);
  } catch (err) {
    handleError(res, err);
  }
};

const generateOptions = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = [
        {
          cost: 0.0,
          status: false,
        },
      ];
      resolve(options);
    } catch (error) {
      reject(error);
    }
  });
};
exports.update = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  const updatedData = nestedObjectsToDotNotation(data);

  try {
    const oldRecord = await MirrorGlassAddonService.findBy({ _id: id });

    if (req.file && req.file.fieldname === "image") {
      updatedData.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.MIRRORGLASSADDONS,
        req.file.filename,
        oldRecord.image
      );
    }

    const record = await MirrorGlassAddonService.update(
      { _id: id },
      updatedData
    );
    handleResponse(res, 200, `${entityType} updated successfully`, record);
  } catch (err) {
    handleError(res, err);
  }
};

exports.modifyExistingRecords = async (req, res) => {
  const companies = await CompanyService.findAll();
  try {
    await Promise.all(
      companies?.map(async (company) =>
        mirrorGlassAddons?.map(
          async (item) =>
            await MirrorGlassAddonService.create({
              ...item,
              company_id: company._id,
            })
        )
      )
    );
    handleResponse(res, 200, "Glass types added successfully");
  } catch (err) {
    handleError(res, err);
  }
};
