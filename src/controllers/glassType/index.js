const GlassTypeService = require("../../services/glassType");
const { nestedObjectsToDotNotation } = require("../../utils/common");
const { handleResponse, handleError } = require("../../utils/responses");
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const path = require('path')

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

  if (req.file && req.file.fieldname === "image") {
    const imagePath = req.file.path;
    const newImagePath = `images/glassType/${path.basename(imagePath)}`;
    const imageBuffer = await readFile(imagePath);
    data.image = newImagePath;
  }

  const glassTypeOptions = await generateOptions();
  GlassTypeService.create({ ...data, options: glassTypeOptions })
    .then((glassType) => {
      handleResponse(res, 200, "Glass Type created successfully", glassType);
    })
    .catch((err) => {
      handleError(res, err);
    });
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
    const oldGlassType = await GlassTypeService.findById(id);

    if (req.file) {
      const newImagePath = `images/glassType/${req.file.filename}`;

      if (oldGlassType && oldGlassType.image) {
        const oldImagePath = `public/${oldGlassType.image}`;
        if (oldGlassType.image.startsWith('images/glassType')) {
          fs.unlinkSync(oldImagePath);
          updatedData.image = newImagePath;
        } else {
          updatedData.image = newImagePath;
        }
      } else {
        updatedData.image = newImagePath;
      }
    }

    const glassType = await GlassTypeService.update({ _id: id }, updatedData);
    handleResponse(res, 200, "glassType updated successfully", glassType);
  } catch (err) {
    handleError(res, err);
  }
};




