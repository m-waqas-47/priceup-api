const { multerSource, multerActions } = require("../../config/common");
const CompanyService = require("../../services/company");
const { addOrUpdateOrDelete } = require("../../services/multer");
const { nestedObjectsToDotNotation } = require("../../utils/common");
const { handleResponse, handleError } = require("../../utils/responses");

exports.getAll = async (req, res) => {
  CompanyService.findAll()
    .then((companies) => {
      handleResponse(res, 200, "All Companies", companies);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.getCompany = async (req, res) => {
  const { id } = req.params;
  CompanyService.findBy({ _id: id })
    .then((company) => {
      handleResponse(res, 200, "Success", company);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.updateCompany = async (req, res) => {
  const { id } = req.params;
  const payload = { ...req.body };
  let data = await nestedObjectsToDotNotation(JSON.parse(payload.data));

  try {
    const oldcompany = await CompanyService.findBy({ _id: id });

    if (req.file && req.file.fieldname === "image") {
    console.log(data,'payload');
      const newImage = await addOrUpdateOrDelete(
        multerActions.PUT,
        multerSource.COMPANIES,
        req.file.filename,
        oldcompany.image
      );
     data = {...data,image:newImage};
    }

    const company = await CompanyService.update({ _id: id }, data);
    handleResponse(res, 200, "Company updated successfully",company);
  } catch (err) {
    handleError(res, err);
  }
  // CompanyService.update({ _id: id }, data)
  //   .then((company) => {
  //     handleResponse(res, 200, "Company updated successfully", company);
  //   })
  //   .catch((err) => {
  //     handleError(res, err);
  //   });
};

exports.deleteCompany = async (req, res) => {
  const { id } = req.params;
  CompanyService.delete({ _id: id })
    .then((company) => {
      handleResponse(res, 200, "Company deleted successfully", company);
    })
    .catch((err) => {
      handleError(res, err);
    });
};

exports.saveCompany = async (req, res) => {
  const data = { ...req.body };
  CompanyService.create(data)
    .then((company) => {
      handleResponse(res, 200, "Company created successfully", company);
    })
    .catch((err) => {
      handleError(res, err);
    });
};
