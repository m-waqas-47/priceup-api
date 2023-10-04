const GlassAddonService = require("../../services/glassAddon");
const { nestedObjectsToDotNotation } = require("../../utils/common");
const { handleResponse, handleError } = require("../../utils/responses");
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const path = require('path')

exports.getAll = async (req, res) => {
  const company_id = req.company_id;
  GlassAddonService.findAll({ company_id: company_id })
    .then((glassAddons) => {
      handleResponse(res, 200, "All Glass Addons", glassAddons);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getGlassAddon = async (req, res) => {
  const { id } = req.params;
  GlassAddonService.findBy({ _id: id })
    .then((glassAddon) => {
      handleResponse(res, 200, "Success", glassAddon);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.updateGlassAddon = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  const updatedData = nestedObjectsToDotNotation(data);

  try {
    const oldHardware = await GlassAddonService.findById(id);

    if (req.file) {
      updatedData.image = `images/adonsType/${req.file.filename}`; 
      if (oldHardware && oldHardware.image) {
        const oldImagePath = `public/${oldHardware.image}`;
        fs.unlinkSync(oldImagePath);
      }
    }

  const glassTypeAddon = await GlassAddonService.update({ _id: id }, updatedData);
  handleResponse(res, 200, "glassTypeAddon updated successfully", glassTypeAddon);
} catch (err) {
  handleError(res, err);
}
};

exports.deleteGlassAddonOptions = async (req, res) => {
  const { id, optionId } = req.params;
  GlassAddonService.update(
    { _id: id },
    { $pull: { options: { _id: optionId } } }
  )
    .then((glassAddon) => {
      handleResponse(
        res,
        200,
        "Glass Addon options removed successfully",
        glassAddon
      );
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.addGlassAddonOptions = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  GlassAddonService.update({ _id: id }, { $push: { options: data } })
    .then((glassAddon) => {
      handleResponse(
        res,
        200,
        "Glass Addon options added successfully",
        glassAddon
      );
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteGlassAddon = async (req, res) => {
  const { id } = req.params;
  GlassAddonService.delete({ _id: id })
    .then((glassAddon) => {
      handleResponse(res, 200, "Glass Addon deleted successfully", glassAddon);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.saveGlassAddon = async (req, res) => {
  const data = { ...req.body };

  if (req.file && req.file.fieldname === "image") {
    const imagePath = req.file.path;
    const newImagePath = `images/adonsType/${path.basename(imagePath)}`;
    const imageBuffer = await readFile(imagePath);
    data.image = newImagePath;
  }
  const glassAddonOptions = await generateOptions();
  GlassAddonService.create({ ...data, options: glassAddonOptions })
    .then((glassAddon) => {
      handleResponse(res, 200, "Glass Addon created successfully", glassAddon);
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
          status: true,
        },
      ];
      resolve(options);
    } catch (error) {
      reject(error);
    }
  });
};
