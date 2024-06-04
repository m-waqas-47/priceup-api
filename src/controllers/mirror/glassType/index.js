const MirrorGlassTypeService = require("@services/mirror/glassType");
const { nestedObjectsToDotNotation } = require("@utils/common");
const { handleResponse, handleError } = require("@utils/responses");
const { addOrUpdateOrDelete } = require("@services/multer");
const { multerActions, multerSource } = require("@config/common");
const CompanyService = require("@services/company");
const { mirrorGlassTypes } = require("@seeders/mirrorGlassTypeSeeder");

exports.getAll = async (req, res) => {
  const company_id = req.company_id;
  MirrorGlassTypeService.findAll({ company_id: company_id })
    .then((glassTypes) => {
      handleResponse(res, 200, "All Glass Types", glassTypes);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getGlassType = async (req, res) => {
  const { id } = req.params;
  MirrorGlassTypeService.findBy({ _id: id })
    .then((glassType) => {
      handleResponse(res, 200, "Success", glassType);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteGlassTypeOptions = async (req, res) => {
  const { id, optionId } = req.params;
  MirrorGlassTypeService.update(
    { _id: id },
    { $pull: { options: { _id: optionId } } }
  )
    .then((glassType) => {
      handleResponse(
        res,
        200,
        "Glass Type options removed successfully",
        glassType
      );
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.addGlassTypeOptions = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  MirrorGlassTypeService.update({ _id: id }, { $push: { options: data } })
    .then((glassType) => {
      handleResponse(
        res,
        200,
        "Glass Type options added successfully",
        glassType
      );
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteGlassType = async (req, res) => {
  const { id } = req.params;
  MirrorGlassTypeService.delete({ _id: id })
    .then((glassType) => {
      handleResponse(res, 200, "Glass Type deleted successfully", glassType);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.saveGlassType = async (req, res) => {
  const data = { ...req.body };
  const company_id = req.company_id;

  try {
    const oldGlassType = await MirrorGlassTypeService.findBy({
      slug: data.slug,
      company_id: company_id,
    });

    if (oldGlassType) {
      throw new Error(
        "Glass Type with exact name already exist. Please name it to something else."
      );
    }
    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.SAVE,
        multerSource.MIRRORGLASSTYPES,
        req.file.path
      );
    }

    const glassTypeOptions = await generateOptions();
    const glassType = await MirrorGlassTypeService.create({
      ...data,
      options: glassTypeOptions,
    });
    handleResponse(res, 200, "GlassAddon created successfully", glassType);
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
          thickness: "1/4",
          status: false,
        },
        {
          cost: 0.0,
          thickness: "1/8",
          status: false,
        },
      ];
      resolve(options);
    } catch (error) {
      reject(error);
    }
  });
};
exports.updateGlassType = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  const updatedData = nestedObjectsToDotNotation(data);

  try {
    const oldGlassType = await MirrorGlassTypeService.findBy({ _id: id });

    if (req.file && req.file.fieldname === "image") {
      updatedData.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.MIRRORGLASSTYPES,
        req.file.filename,
        oldGlassType.image
      );
    }

    const glassType = await MirrorGlassTypeService.update(
      { _id: id },
      updatedData
    );
    handleResponse(res, 200, "Glass Type updated successfully", glassType);
  } catch (err) {
    handleError(res, err);
  }
};

exports.modifyExistingRecords = async (req, res) => {
  const companies = await CompanyService.findAll();
  try {
    await Promise.all(
      companies?.map(async (company) =>
        mirrorGlassTypes?.map(
          async (item) =>
            await MirrorGlassTypeService.create({
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
