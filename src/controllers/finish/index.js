const FinishService = require("../../services/finish");
const HardwareService = require("../../services/hardware");
const { handleResponse, handleError } = require("../../utils/responses");
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const path = require('path')

exports.getAll = async (req, res) => {
  const company_id = req.company_id;
  FinishService.findAll({ company_id: company_id })
    .then((finishes) => {
      handleResponse(res, 200, "All Finishes", finishes);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getFinish = async (req, res) => {
  const { id } = req.params;
  FinishService.findBy({ _id: id })
    .then((finish) => {
      handleResponse(res, 200, "Success", finish);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.saveFinish = async (req, res) => {
  const data = { ...req.body };
  const company_id = req.company_id;

  try {
    
  if (req.file && req.file.fieldname === "image") {
    const imagePath = req.file.path;
    const newImagePath = `images/newFinish/${path.basename(imagePath)}`;
    const imageBuffer = await readFile(imagePath);
    data.image = newImagePath;
  }
    const finish = await FinishService.create({
      ...data,
    });

    const hardwares = await HardwareService.findAll({ company_id: company_id });
    await Promise.all(
      hardwares.map(async (hardware) => {
        const finishData = {
          name: finish.name,
          image: finish.image,
          partNumber: finish.partNumber,
          cost: finish.cost,
          thickness: "1/2",
          status: finish.status,
          finish_id: finish._id,
        };
        await HardwareService.update(
          { _id: hardware._id },
          {
            $push: { finishes: finishData },
          }
        );
        await HardwareService.update(
          { _id: hardware._id },
          {
            $push: { finishes: { ...finishData, thickness: "3/8" } },
          }
        );
      })
    );

    handleResponse(res, 200, "Finish created successfully", finish);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteFinish = async (req, res) => {
  const { id } = req.params;
  const company_id = req.company_id;
  try {
    const finish = await FinishService.delete({ _id: id });
    const hardwares = await HardwareService.findAll({ company_id: company_id });
    hardwares?.map(async (hardware) => {
      HardwareService.update(
        { _id: hardware._id },
        { $pull: { finishes: { finish_id: id } } }
      );
    });
    handleResponse(res, 200, "Finish deleted successfully", finish);
  } catch (err) {
    handleError(res, err);
  }
};
exports.updateFinish = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  const company_id = req.company_id;

  try {
    const oldFinish = await FinishService.findById(id);

    if (req.file) {
      const newImagePath = `images/newFinish/${req.file.filename}`;

      if (oldFinish && oldFinish.image) {
        const oldImagePath = `public/${oldFinish.image}`;
        if (oldFinish.image.startsWith('images/newFinish')) {
          fs.unlinkSync(oldImagePath);
          data.image = newImagePath;
        } else {
          data.image = newImagePath;
        }
      } else {
        data.image = newImagePath;
      }
    }

    await FinishService.update({ _id: id }, data);

    const hardwares = await HardwareService.findAll({ company_id: company_id });
    for (const hardware of hardwares) {
      const items = hardware?.finishes?.filter((item) => item.finish_id.toString() === id);
      for (const item of items) {
        await HardwareService.update(
          { _id: hardware._id, "finishes._id": item._id },
          {
            $set: {
              "finishes.$.name": data?.name,
              "finishes.$.image": data?.image,
            },
          }
        );
      }
    }

    handleResponses(res, 200, "Finish updated successfully", data);
  } catch (err) {
    console.error(err);
    handleErrors(res, err);
  }
};

function handleResponses(res, status, message, data) {
  res.status(status).json({ message, data });
}
function handleErrors(res, err) {
  console.error(err);
  res.status(500).json({ error: "An error occurred." });
}


