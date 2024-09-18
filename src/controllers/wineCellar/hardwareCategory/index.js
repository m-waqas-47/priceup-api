const Service = require("@services/wineCellar/hardwareCategory");
const {handleResponse, handleError} = require("@utils/responses");
const {wineCellarHardwareCategories} = require("@seeders/wineCellarHardwareCategoriesSeeder");

exports.getAll = async (req, res) => {
    Service.findAll()
        .then((categories) => {
            handleResponse(res, 200, "All Records", categories);
        })
        .catch((err) => {
            handleError(res, err);
        });
};

exports.getSingle = async (req, res) => {
    const { id } = req.params;
    Service.findBy({ _id: id })
        .then((record) => {
            handleResponse(res, 200, "Success", record);
        })
        .catch((err) => {
            handleError(res, err);
        });
};

exports.save = async (req, res) => {
    const data = { ...req.body };
    Service.create(data)
        .then((category) => {
            handleResponse(
                res,
                200,
                "Record created successfully",
                category
            );
        })
        .catch((err) => {
            handleError(res, err);
        });
};

exports.updateExistingCollection = async (req, res) => {
    try {
       await Promise.all(
            wineCellarHardwareCategories.map(async (record) => {
                await Service.create(record);
            })
       );
        handleResponse(res, 200, "Records created");
    } catch (err) {
        handleError(res, err);
    }
};