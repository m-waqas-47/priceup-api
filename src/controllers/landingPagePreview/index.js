const CustomerService = require("@services/customer");
const MailgunService = require("@services/mailgun");
const { landingPagePreview } = require("@templates/email");
const { handleError, handleResponse } = require("@utils/responses");
const { default: mongoose } = require("mongoose");
const LandingPagePreviewService = require("@services/landingPagePreview");
const { multerActions, multerSource } = require("@config/common");
const EstimateService = require("@services/estimate");
const { addOrUpdateOrDelete } = require("@services/multer");

exports.getAllLandingPagePreview = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error("Project Id is required");
    }
    const records = await LandingPagePreviewService.findAll({
      project_id: new mongoose.Types.ObjectId(id),
    });
    handleResponse(res, 200, "Success", records);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getPendingEstimatesForLandingPagePreview = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error("Project Id is required");
    }
    let estimateIdsArray = [];
    const allPreviews = await LandingPagePreviewService.findAll({
      project_id: new mongoose.Types.ObjectId(id),
    });
    allPreviews?.forEach((preview) => {
      preview?.estimates?.forEach((estimate) => {
        if (estimate?.estimate_id) {
          estimateIdsArray.push(
            new mongoose.Types.ObjectId(estimate?.estimate_id)
          );
        }
      });
    });
    const resp = await EstimateService.findAllWithPipeline({
      _id: { $nin: estimateIdsArray },
      project_id: new mongoose.Types.ObjectId(id),
    });
    handleResponse(res, 200, "Success", resp?.estimates);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getLandingPagePreview = async (req, res) => {
  const { id } = req.params;
  try {
    const invoicePreviewRecord = await LandingPagePreviewService.findBy({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!invoicePreviewRecord) {
      return handleResponse(res, 200, "No preview found", null);
    }
    return handleResponse(res, 200, "Success", invoicePreviewRecord);
  } catch (err) {
    handleError(res, err);
  }
};

exports.createLandingPagePreview = async (req, res) => {
  const data = { ...req.body };
  const user = req.user;
  try {
    const resp = await LandingPagePreviewService.create({
      ...data,
      company_id: user.company_id,
    });
    handleResponse(res, 200, "Invoice preview generated", resp);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteLandingPagePreview = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error("Id is required");
    }
    const resp = await LandingPagePreviewService.delete({
      _id: new mongoose.Types.ObjectId(id),
    });
    handleResponse(res, 200, "Success", resp);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateLandingPagePreview = async (req, res) => {
  const data = { ...req.body };
  const { id } = req.params;
  try {
    let resp = null;
    if (!id) {
      throw new Error("Id is required");
    }
    const foundRecord = await LandingPagePreviewService.findBy({ _id: id });
    if (foundRecord) {
      // Access the value dynamically
      const dynamicValue = getValueByPath(foundRecord, data?.key);
      console.log(dynamicValue, "value");
      if (req.file && req.file.fieldname === "image" && data?.key) {
        const path = await addOrUpdateOrDelete(
          multerActions.PUT,
          multerSource.PROJECTS,
          req.file.filename,
          dynamicValue ?? ""
        );
        const updateData = {
          [data.key]: path, // Use computed property names
        };
        resp = await LandingPagePreviewService.update({ _id: id }, updateData, {
          new: true,
        });
      } else {
        resp = await LandingPagePreviewService.update({ _id: id }, data, {
          new: true,
        });
      }

      // if (resp && resp?.customer_id) {
      //   const customer = await CustomerService.findBy({
      //     _id: new mongoose.Types.ObjectId(resp?.customer_id),
      //   });
      //   if (customer) {
      //     const html = landingPagePreview(resp.customerPreview?.link ?? "");
      //     await MailgunService.sendEmail(
      //       customer.email,
      //       "Priceup: Quote Preview",
      //       html
      //     );
      //   }
      // }
    }
    handleResponse(res, 200, "Success", resp);
  } catch (err) {
    handleError(res, err);
  }
};

const getValueByPath = (obj, path) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

const deleteAllImages = async (record) => {
  try {
    // section 1

    // section 2

    // section 3
    console.log("image deleted");
  } catch (err) {
    console.error(err);
  }
};
