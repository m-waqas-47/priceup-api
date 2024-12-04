const Service = require("@services/wineCellar/glassAddon");
const { nestedObjectsToDotNotation } = require("@utils/common");
const { handleResponse, handleError } = require("@utils/responses");
const { addOrUpdateOrDelete } = require("@services/multer");
const { multerSource, multerActions } = require("@config/common");

exports.getAll = async (req, res) => {
  const company_id = req.user.company_id;
  Service.findAll({ company_id: company_id })
    .then((glassAddons) => {
      handleResponse(res, 200, "All Glass Addons", glassAddons);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getGlassAddon = async (req, res) => {
  const { id } = req.params;
  Service.findBy({ _id: id })
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
    const oldGlassAddon = await Service.findBy({ _id: id });

    if (req.file && req.file.fieldname === "image") {
      updatedData.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.WINECELLARGLASSADDONS,
        req.file.filename,
        oldGlassAddon.image
      );
    }

    const glassAddon = await Service.update({ _id: id }, updatedData,{new: true});
    handleResponse(res, 200, "Record updated successfully", glassAddon);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteGlassAddonOptions = async (req, res) => {
  const { id, optionId } = req.params;
  Service.update(
    { _id: id },
    { $pull: { options: { _id: optionId } } },
    {new: true}
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
  Service.update({ _id: id }, { $push: { options: data } }, {new: true})
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
  try {
    const record = await Service.delete({ _id: id });
    if (
      record &&
      record.image &&
      record.image.startsWith("images/wineCellarGlassAddons/uploads")
    ) {
      await addOrUpdateOrDelete(
        multerActions.DELETE,
        multerSource.WINECELLARGLASSADDONS,
        record.image
      );
    }
    handleResponse(res, 200, "Record deleted successfully", record);
  } catch (err) {
    handleError(res, err);
  }
};

exports.saveGlassAddon = async (req, res) => {
  const data = { ...req.body };
  const company_id = req.user.company_id;
  try {
    const oldGlassAddon = await Service.findBy({
      slug: data.slug,
      company_id: company_id,
    });

    if (oldGlassAddon) {
      throw new Error(
        "Glass Addon with exact name already exist. Please name it to something else."
      );
    }
    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.SAVE,
        multerSource.WINECELLARGLASSADDONS,
        req.file.path
      );
    }

    const glassAddonOptions = await generateOptions();
    const glassAddon = await Service.create({
      ...data,
      options: glassAddonOptions,
    });
    handleResponse(res, 200, "GlassAddon created successfully", glassAddon);
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
          status: true,
        },
      ];
      resolve(options);
    } catch (error) {
      reject(error);
    }
  });
};
