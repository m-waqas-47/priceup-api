const Service = require("@services/wineCellar/glassType");
const { handleResponse, handleError } = require("@utils/responses");
const { addOrUpdateOrDelete } = require("@services/multer");
const { nestedObjectsToDotNotation } = require("@utils/common");
const { multerActions, multerSource } = require("@config/common");
const CompanyService = require("@services/company");
const { wineCellarGlassTypes } = require("@seeders/wineCellarGlassTypeSeeder");
const assetsPath = `images/${multerSource.WINECELLARGLASSTYPES}/uploads`;

exports.getAll = async (req, res) => {
    const company_id = req.user.company_id;
    Service.findAll({ company_id: company_id })
        .then((records) => {
            handleResponse(res, 200, "All Records", records);
        })
        .catch((err) => {
            handleError(res, err);
        });
};

exports.getSingle = async (req, res) => {
    const { id } = req.params;
    Service.findBy({ _id: id })
        .then((record) => {
            handleResponse(res, 200, "Single Record", record);
        })
        .catch((err) => {
            handleError(res, err);
        });
};

exports.deleteRecord = async (req, res) => {
    const { id } = req.params;
    try {
    const record = await Service.delete({ _id: id });
    if (
        record &&
        record.image &&
        record.image.startsWith(assetsPath)
    ) {
        await addOrUpdateOrDelete(
            multerActions.DELETE,
            multerSource.WINECELLARGLASSTYPES,
            record.image
        );
    }
    handleResponse(res, 200, "Record deleted successfully", record);
    } catch (err) {
        handleError(res, err);
    }
};

exports.save = async (req, res) => {
    const data = { ...req.body };
    const company_id = req.user.company_id;

    try {
        const oldRecord = await Service.findBy({
            slug: data.slug,
            company_id: company_id,
        });

        if (oldRecord) {
            throw new Error(
                "Glass Type with exact name already exist. Please name it to something else."
            );
        }
        if (req.file && req.file.fieldname === "image") {
            data.image = await addOrUpdateOrDelete(
                multerActions.SAVE,
                multerSource.WINECELLARGLASSTYPES,
                req.file.path
            );
        }

        const glassTypeOptions = await generateOptions();
        const glassType = await Service.create({
            ...data,
            options: glassTypeOptions,
        });
        handleResponse(res, 200, "Record created successfully", glassType);
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
                    thickness: "1/2",
                    status: false,
                },
                {
                    cost: 0.0,
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
exports.update = async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };
    // const company_id = req.user.company_id;
    const updatedData = nestedObjectsToDotNotation(data);

    try {
        const oldRecord = await Service.findBy({ _id: id });

        if (req.file && req.file.fieldname === "image") {
            updatedData.image = await addOrUpdateOrDelete(
                multerActions.PUT,
                multerSource.WINECELLARGLASSTYPES,
                req.file.filename,
                oldRecord.image
            );
        }

        const record = await Service.update({ _id: id }, updatedData);
        handleResponse(res, 200, "Record updated successfully", record);
    } catch (err) {
        handleError(res, err);
    }
};

exports.updateExistingCollection = async (req, res) => {
    const companies = await CompanyService.findAll();
    try {
        await Promise.all(
            companies.map(async (company) => {
              await Promise.all(
                wineCellarGlassTypes.map(async (record) => {
                  await Service.create({
                    ...record,
                    company_id: company._id
                  });
                })
              );
            })
          );
      handleResponse(res, 200, "Records created");
    } catch (err) {
      handleError(res, err);
    }
};