const LayoutService = require("../../services/layout");
const {
  nestedObjectsToDotNotation,
  getListsData,
} = require("../../utils/common");
const { handleResponse, handleError } = require("../../utils/responses");

exports.getAll = async (req, res) => {
  const company_id = req.company_id;
  LayoutService.findAll({ company_id: company_id })
    .then((layouts) => {
      handleResponse(res, 200, "All Layouts", layouts);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getLayout = async (req, res) => {
  const { id } = req.params;
  LayoutService.findBy({ _id: id })
    .then(async (layout) => {
      const company_id = req.company_id;
      const listData = await getListsData(company_id);
      handleResponse(res, 200, "Success", {
        layoutData: layout,
        listData: listData,
      });
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.updateLayout = async (req, res) => {
  const { id } = req.params;
  const payload = { ...req.body };
  const data = await nestedObjectsToDotNotation(payload);
    LayoutService.update({ _id: id }, data)
    .then((layout) => {
      handleResponse(res, 200, "Layout updated successfully", layout);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.deleteLayout = async (req, res) => {
  const { id } = req.params;
  LayoutService.delete({ _id: id })
    .then((layout) => {
      handleResponse(res, 200, "Layout deleted successfully", layout);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.saveLayout = async (req, res) => {
  const data = { ...req.body };
  LayoutService.create(data)
    .then((layout) => {
      handleResponse(res, 200, "Layout created successfully", layout);
    })
    .catch((err) => {
      handleError(res, err);
    });
};
