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
  HardwareService.delete({ _id: id })
    .then((hardware) => {
      handleResponse(res, 200, "Hardware deleted succefully", hardware);
    })
    .catch((err) => {
      handleError(res, err);
    });
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

  if (req.file && req.file.fieldname === "image") {
    const imagePath = req.file.path;
    const newImagePath = `images/newHardware/${path.basename(imagePath)}`;
    const imageBuffer = await readFile(imagePath);
    data.image = newImagePath;
  }
  const finishes = await FinishService.findAll({ company_id: company_id });
  const generateFinishesFormat = await generateFinishes(finishes);

  HardwareService.create({ ...data, finishes: generateFinishesFormat })
    .then((hardware) => {
      handleResponse(res, 200, "Hardware created successfully", hardware);
    })
    .catch((err) => {
      handleError(res, err);
    });
};
exports.updateHardware = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  const updatedData = nestedObjectsToDotNotation(data);

  try {
    const oldHardware = await HardwareService.findBy({_id:id});

    if (req.file) {
      const newImagePath = `images/newHardware/${req.file.filename}`;

      if (oldHardware && oldHardware.image) {
        const oldImagePath = `public/${oldHardware.image}`;
        if (oldHardware.image.startsWith("images/newHardware")) {
          fs.unlinkSync(oldImagePath);
          updatedData.image = newImagePath;
        } else {
          updatedData.image = newImagePath;
        }
      } else {
        updatedData.image = newImagePath;
      }
    }

    const hardware = await HardwareService.update({ _id: id }, updatedData);
    handleResponse(res, 200, "Hardware updated successfully", hardware);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateExistingHardware = async (req, res) => {
  const exist = HardwareCategoryService.findBy({ slug: "corner-clamps" });
  if (!exist) {
    await HardwareCategoryService.create({
      name: "Corner Clamps",
      slug: "corner-clamps",
      status: true,
    });
  }
  const hardwares = await HardwareService.findAllBy({ slug: "corner-clamp" });
  try {
    await Promise.all(
      hardwares?.map(async (hardware) => {
        await HardwareService.update(
          { _id: hardware._id },
          { hardware_category_slug: "corner-clamps" }
        );
      })
    );
    handleResponse(res, 200, "Hardware info updated");
  } catch (err) {
    handleError(res, err);
  }
};
