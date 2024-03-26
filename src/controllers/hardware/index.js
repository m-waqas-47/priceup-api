const FinishService = require("../../services/finish");
const HardwareService = require("../../services/hardware");
const { nestedObjectsToDotNotation } = require("../../utils/common");
const { handleResponse, handleError } = require("../../utils/responses");
const { generateFinishes } = require("../user");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const path = require("path");
const HardwareCategoryService = require("../../services/hardwareCategory");
const CompanyService = require("../../services/company");
const { addOrUpdateOrDelete } = require("../../services/multer");
const { multerSource, multerActions } = require("../../config/common");

exports.getAll = async (req, res) => {
  const company_id = req.company_id;
  HardwareService.findAll({ company_id: company_id })
    .then((hardwares) => {
      handleResponse(res, 200, "All Hardwares", hardwares);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getHardware = async (req, res) => {
  const { id } = req.params;
  HardwareService.findBy({ _id: id })
    .then((hardware) => {
      handleResponse(res, 200, "Success", hardware);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteHardwareFinishes = async (req, res) => {
  const { id, finishItemId } = req.params;
  HardwareService.update(
    { _id: id },
    { $pull: { finishes: { _id: finishItemId } } }
  )
    .then((hardware) => {
      handleResponse(
        res,
        200,
        "Hardware Finishes removed successfully",
        hardware
      );
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.addHardwareFinishes = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  HardwareService.update({ _id: id }, { $push: { finishes: data } })
    .then((hardware) => {
      handleResponse(
        res,
        200,
        "Hardware Finishes added successfully",
        hardware
      );
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteHardware = async (req, res) => {
  const { id } = req.params;
  try {
    const Hardware = await HardwareService.delete({ _id: id });
    if (
      Hardware &&
      Hardware.image &&
      Hardware.image.startsWith("images/hardwares/uploads")
    ) {
      await addOrUpdateOrDelete(
        multerActions.DELETE,
        multerSource.HARDWARES,
        Hardware.image
      );
    }
    handleResponse(res, 200, "Hardware deleted successfully", Hardware);
  } catch (err) {
    handleError(res, err);
  }

  // HardwareService.delete({ _id: id })
  //   .then((hardware) => {
  //     handleResponse(res, 200, "Hardware deleted succefully", hardware);
  //   })
  //   .catch((err) => {
  //     handleError(res, err);
  //   });
};

exports.getHardwaresByCategory = async (req, res) => {
  const { slug } = req.params;
  const company_id = req.company_id;
  HardwareService.findAllBy({
    hardware_category_slug: slug,
    company_id: company_id,
  })
    .then((hardwares) => {
      handleResponse(res, 200, "All Hardwares", hardwares);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.saveHardware = async (req, res) => {
  const data = { ...req.body };
  const company_id = req.company_id;

  try {
    const oldHardware = await HardwareService.findBy({
      slug: data.slug,
      company_id: company_id,
    });

    if (oldHardware) {
      throw new Error(
        "Hardware with exact name already exist. Please name it to something else."
      );
    }

    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.SAVE,
        multerSource.HARDWARES,
        req.file.path
      );
    }

    const finishes = await FinishService.findAll({ company_id: company_id });
    const generateFinishesFormat = await generateFinishes(finishes);
    const hardware = await HardwareService.create({
      ...data,
      finishes: generateFinishesFormat,
    });
    handleResponse(res, 200, "Hardware created successfully", hardware);
  } catch (err) {
    handleError(res, err);
  }
};
exports.updateHardware = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  // const company_id = req.company_id;
  const updatedData = nestedObjectsToDotNotation(data);

  try {
    const oldHardware = await HardwareService.findBy({ _id: id });
    // let foundWithSameName = false;
    // let oldHardware = null;
    // const allHardwares = await HardwareService.findAll({
    //   company_id: company_id,
    // });
    // allHardwares.forEach((hardware) => {
    //   if (hardware.slug === data.slug && hardware.id !== id) foundWithSameName = true;
    //   if (hardware.id === id) oldHardware = hardware;
    // });

    // if (foundWithSameName) {
    //   throw new Error(
    //     "Hardware with exact name already exist. Please name it to something else."
    //   );
    // }

    if (req.file && req.file.fieldname === "image") {
      updatedData.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.HARDWARES,
        req.file.filename,
        oldHardware.image
      );
    }
    const hardware = await HardwareService.update({ _id: id }, updatedData);
    handleResponse(res, 200, "Hardware updated successfully", hardware);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateExistingHardware = async (req, res) => {
  const hardwares = await HardwareService.findAll();
  try {
    await Promise.all(
      hardwares?.map(async (hardware) => {
        await HardwareService.update(
          { _id: hardware._id },
          { oneInchHoles: 0, hingeCut: 0, clampCut: 0, notch: 0, outages: 0 }
        );
      })
    );
    handleResponse(res, 200, "Hardware info updated");
  } catch (err) {
    handleError(res, err);
  }
};
