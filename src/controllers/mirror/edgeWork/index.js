const MirrorEdgeWorkService = require("@services/mirror/edgeWork");
const { nestedObjectsToDotNotation } = require("@utils/common");
const { handleResponse, handleError } = require("@utils/responses");
const { addOrUpdateOrDelete } = require("@services/multer");
const { multerActions, multerSource } = require("@config/common");
const CompanyService = require("@services/company");
const { mirrorEdgeWork } = require("@seeders/mirrorEdgeWorkSeeder");

exports.getAll = async (req, res) => {
  const company_id = req.company_id;
  MirrorEdgeWorkService.findAll({ company_id: company_id })
    .then((edgeWorks) => {
      handleResponse(res, 200, "All Edge Works", edgeWorks);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getEdgeWork = async (req, res) => {
  const { id } = req.params;
  MirrorEdgeWorkService.findBy({ _id: id })
    .then((edgeWork) => {
      handleResponse(res, 200, "Success", edgeWork);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteEdgeWorkOptions = async (req, res) => {
  const { id, optionId } = req.params;
  MirrorEdgeWorkService.update(
    { _id: id },
    { $pull: { options: { _id: optionId } } }
  )
    .then((edgeWork) => {
      handleResponse(
        res,
        200,
        "Edge work options removed successfully",
        edgeWork
      );
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.addEdgeWorkOptions = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  MirrorEdgeWorkService.update({ _id: id }, { $push: { options: data } })
    .then((edgeWork) => {
      handleResponse(
        res,
        200,
        "Edge work options added successfully",
        edgeWork
      );
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteEdgeWork = async (req, res) => {
  const { id } = req.params;
  MirrorEdgeWorkService.delete({ _id: id })
    .then((edgeWork) => {
      handleResponse(res, 200, "Edge work deleted successfully", edgeWork);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.saveEdgeWork = async (req, res) => {
  const data = { ...req.body };
  const company_id = req.company_id;

  try {
    const oldEdgeWork = await MirrorEdgeWorkService.findBy({
      slug: data.slug,
      company_id: company_id,
    });

    if (oldEdgeWork) {
      throw new Error(
        "Edge work with exact name already exist. Please name it to something else."
      );
    }
    if (req.file && req.file.fieldname === "image") {
      data.image = await addOrUpdateOrDelete(
        multerActions.SAVE,
        multerSource.MIRROREDGEWORKS,
        req.file.path
      );
    }

    const edgeWorkOptions = await generateOptions();
    const edgeWork = await MirrorEdgeWorkService.create({
      ...data,
      options: edgeWorkOptions,
    });
    handleResponse(res, 200, "Edge work created successfully", edgeWork);
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
exports.updateEdgeWork = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  // const company_id = req.company_id;
  const updatedData = nestedObjectsToDotNotation(data);

  try {
    const oldEdgeWork = await MirrorEdgeWorkService.findBy({ _id: id });

    if (req.file && req.file.fieldname === "image") {
      updatedData.image = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.MIRROREDGEWORKS,
        req.file.filename,
        oldEdgeWork.image
      );
    }

    const edgeWork = await MirrorEdgeWorkService.update(
      { _id: id },
      updatedData
    );
    handleResponse(res, 200, "Edge work updated successfully", edgeWork);
  } catch (err) {
    handleError(res, err);
  }
};

exports.modifyExistingRecords = async (req, res) => {
  const companies = await CompanyService.findAll();
  try {
    await Promise.all(
      companies?.map(async (company) =>
        mirrorEdgeWork?.map(
          async (item) =>
            await MirrorEdgeWorkService.create({
              ...item,
              company_id: company._id,
            })
        )
      )
    );
    handleResponse(res, 200, "Edge Works added successfully");
  } catch (err) {
    handleError(res, err);
  }
};
