const GlassTreatmentService = require("../../services/glassTreatment");
const { nestedObjectsToDotNotation } = require("../../utils/common");
const { handleResponse, handleError } = require("../../utils/responses");
const { generateOptions } = require("../glassType");

exports.getAll = async (req, res) => {
  const company_id = req.company_id;
  GlassTreatmentService.findAll({ company_id: company_id })
    .then((glassTreatments) => {
      handleResponse(res, 200, "All Glass Treatments", glassTreatments);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getGlassTreatment = async (req, res) => {
  const { id } = req.params;
  GlassTreatmentService.findBy({ _id: id })
    .then((glassTreatment) => {
      handleResponse(res, 200, "Success", glassTreatment);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.updateGlassTreatment = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  const updatedData = nestedObjectsToDotNotation(data);
  GlassTreatmentService.update({ _id: id }, updatedData)
    .then((glassTreatment) => {
      handleResponse(
        res,
        200,
        "Glass Treatment updated successfully",
        glassTreatment
      );
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteGlassTreatmentOptions = async (req, res) => {
  const { id, optionId } = req.params;
  GlassTreatmentService.update(
    { _id: id },
    { $pull: { options: { _id: optionId } } }
  )
    .then((glassTreatment) => {
      handleResponse(
        res,
        200,
        "Glass Treatment options removed successfully",
        glassTreatment
      );
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.addGlassTreatmentOptions = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  GlassTreatmentService.update({ _id: id }, { $push: { options: data } })
    .then((glassTreatment) => {
      handleResponse(
        res,
        200,
        "Glass Treatment options added successfully",
        glassTreatment
      );
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteGlassTreatment = async (req, res) => {
  const { id } = req.params;
  GlassTreatmentService.delete({ _id: id })
    .then((glassTreatment) => {
      handleResponse(
        res,
        200,
        "Glass Treatment deleted successfully",
        glassTreatment
      );
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.saveGlassTreatment = async (req, res) => {
  const data = { ...req.body };
  const glassTreatmentOptions = await generateOptions();
  GlassTreatmentService.create({ ...data, options: glassTreatmentOptions })
    .then((glassTreatment) => {
      handleResponse(
        res,
        200,
        "Glass Treatment created successfully",
        glassTreatment
      );
    })
    .catch((err) => {
      handleError(res, err);
    });
};
