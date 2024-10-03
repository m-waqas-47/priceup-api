const MirrorHardwareService = require("@services/mirror/hardware");
const { nestedObjectsToDotNotation } = require("@utils/common");
const { handleResponse, handleError } = require("@utils/responses");
const { addOrUpdateOrDelete } = require("@services/multer");
const { multerActions, multerSource } = require("@config/common");
const CompanyService = require("@services/company");
const { mirrorHardwares } = require("@seeders/mirrorHardwareSeeder");
const entityType = "Hardware";
exports.getAll = async (req, res) => {
  const company_id = req.user.company_id;
  MirrorHardwareService.findAll({ company_id: company_id })
    .then((records) => {
      handleResponse(res, 200, `All ${entityType}s`, records);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.get = async (req, res) => {
  const { id } = req.params;
  MirrorHardwareService.findBy({ _id: id })
    .then((record) => {
      handleResponse(res, 200, "Success", record);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteOptions = async (req, res) => {
  const { id, optionId } = req.params;
  MirrorHardwareService.update(
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
  MirrorHardwareService.update({ _id: id }, { $push: { options: data } })
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
  MirrorHardwareService.delete({ _id: id })
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
    const oldRecord = await MirrorHardwareService.findBy({
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
        multerSource.MIRRORHARDWARES,
        req.file.path
      );
    }

    const options = await generateOptions();
    const record = await MirrorHardwareService.create({
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
    const oldRecord = await MirrorHardwareService.findBy({ _id: id });

    if (req.file && req.file.fieldname === "image") {
      updatedData.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.MIRRORHARDWARES,
        req.file.filename,
        oldRecord.image
      );
    }

    const record = await MirrorHardwareService.update(
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
    const filteredHardware = mirrorHardwares.filter((item)=>item.slug !== 'bevel-strip');
    await Promise.all(
      companies?.map(async (company) =>
        filteredHardware?.map(
          async (item) =>
            await MirrorHardwareService.create({
              ...item,
              company_id: company._id,
            })
        )
      )
    );
    handleResponse(res, 200, `Hardwares added successfully`,filteredHardware);
  } catch (err) {
    handleError(res, err);
  }
};
