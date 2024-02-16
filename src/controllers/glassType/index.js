const GlassTypeService = require("../../services/glassType");
const { nestedObjectsToDotNotation } = require("../../utils/common");
const { handleResponse, handleError } = require("../../utils/responses");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const path = require("path");
const { addOrUpdateOrDelete } = require("../../services/multer");
const { multerActions, multerSource } = require("../../config/common");

exports.getAll = async (req, res) => {
  const company_id = req.company_id;
  GlassTypeService.findAll({ company_id: company_id })
    .then((glassTypes) => {
      handleResponse(res, 200, "All Glass Types", glassTypes);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getGlassType = async (req, res) => {
  const { id } = req.params;
  GlassTypeService.findBy({ _id: id })
    .then((glassType) => {
      handleResponse(res, 200, "Success", glassType);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteGlassTypeOptions = async (req, res) => {
  const { id, optionId } = req.params;
  GlassTypeService.update(
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
  GlassTypeService.update({ _id: id }, { $push: { options: data } })
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
  GlassTypeService.delete({ _id: id })
    .then((glassType) => {
      handleResponse(res, 200, "Glass Type deleted successfully", glassType);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.saveGlassType = async (req, res) => {
  const data = { ...req.body };

  try {
    const oldGlassType = await GlassTypeService.findBy({
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
        multerSource.GLASSTYPES,
        req.file.path
      );
    }

    const glassTypeOptions = await generateOptions();
    const glassType = await GlassTypeService.create({
      ...data,
      options: glassTypeOptions,
    });
    handleResponse(res, 200, "GlassAddon created successfully", glassType);
  } catch (err) {
    handleError(res, err);
  }

  // GlassTypeService.create({ ...data, options: glassTypeOptions })
  //   .then((glassType) => {
  //     handleResponse(res, 200, "Glass Type created successfully", glassType);
  //   })
  //   .catch((err) => {
  //     handleError(res, err);
  //   });
};

const generateOptions = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = [
        {
          partNumber: "",
          cost: 0.0,
          priceBySqFt: true,
          thickness: "1/2",
          status: false,
        },
        {
          partNumber: "",
          cost: 0.0,
          priceBySqFt: true,
          thickness: "3/8",
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
    // const oldGlassType = await GlassTypeService.findBy({ _id: id });
    let foundWithSameName = false;
    let oldGlassType = null;
    const allGlassTypes = await GlassTypeService.findAll({ company_id: company_id });
    allGlassTypes.forEach((glassType) => {
      if (glassType.slug === data.slug) foundWithSameName = true;
      if (glassType._id === id) oldGlassType = glassType;
    });

    if (foundWithSameName) {
      throw new Error("Glass Type with exact name already exist. Please name it to something else.");
    }

    if (req.file && req.file.fieldname === "image") {
      updatedData.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.GLASSTYPES,
        req.file.filename,
        oldGlassType.image
      );
    }

    const glassType = await GlassTypeService.update({ _id: id }, updatedData);
    handleResponse(res, 200, "glassType updated successfully", glassType);
  } catch (err) {
    handleError(res, err);
  }
};
