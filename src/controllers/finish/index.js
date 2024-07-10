const FinishService = require("../../services/finish");
const HardwareService = require("../../services/hardware");
const { handleResponse, handleError } = require("../../utils/responses");
const { addOrUpdateOrDelete } = require("../../services/multer");
const { multerActions, multerSource } = require("../../config/common");

exports.getAll = async (req, res) => {
  const company_id = req.user.company_id;
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
  const company_id = req.user.company_id;

  try {
    const oldFinish = await FinishService.findBy({
      slug: data.slug,
      company_id: company_id,
    });
    if (oldFinish) {
      throw new Error(
        "Finish with exact name already exist. Please name it to something else."
      );
    }
    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.SAVE,
        multerSource.FINISHES,
        req.file.path
      );
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
          status: finish.status,
          finish_id: finish._id,
        };
        await HardwareService.update(
          { _id: hardware._id },
          {
            $push: { finishes: finishData },
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
  const company_id = req.user.company_id;
  try {
    const finish = await FinishService.delete({ _id: id });
    if (
      finish &&
      finish.image &&
      finish.image?.startsWith("images/finishes/uploads")
    ) {
      await addOrUpdateOrDelete(
        multerActions.DELETE,
        multerSource.FINISHES,
        finish.image
      );
    }
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
  const company_id = req.user.company_id;

  try {
    // let foundWithSameName = false;
    // let oldFinish = null;
    // const allFinishes = await FinishService.findAll({ company_id: company_id });
    // allFinishes.forEach((finish) => {
    //   if (finish.name === data.name && finish.id !== id)
    //     foundWithSameName = true;
    //   if (finish.id === id) oldFinish = finish;
    // });

    // if (foundWithSameName) {
    //   throw new Error(
    //     "Finish with exact name already exist. Please name it to something else."
    //   );
    // }
    const oldFinish = await FinishService.findBy({ _id: id });

    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.FINISHES,
        req.file.filename,
        oldFinish.image
      );
    }

    await FinishService.update({ _id: id }, data);

    const hardwares = await HardwareService.findAll({ company_id: company_id });
    for (const hardware of hardwares) {
      const items = hardware?.finishes?.filter(
        (item) => item.finish_id.toString() === id
      );
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

    handleResponse(res, 200, "Finish updated successfully", data);
  } catch (err) {
    console.error(err);
    handleError(res, err);
  }
};
