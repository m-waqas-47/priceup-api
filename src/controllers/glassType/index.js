const GlassTypeService = require("../../services/glassType");
const { nestedObjectsToDotNotation } = require("../../utils/common");
const { handleResponse, handleError } = require("../../utils/responses");

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

exports.updateGlassType = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  const updatedData = nestedObjectsToDotNotation(data);
  GlassTypeService.update({ _id: id }, updatedData)
    .then((glassType) => {
      handleResponse(res, 200, "Glass Type updated successfully", glassType);
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
  const glassTypeOptions = await this.generateOptions();
  GlassTypeService.create({ ...data, options: glassTypeOptions })
    .then((glassType) => {
      handleResponse(res, 200, "Glass Type created successfully", glassType);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.generateOptions = () => {
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
