const Service = require("@services/wineCellar/layout");
const {
    nestedObjectsToDotNotation,
    getWineCellarHardwareList,
} = require("@utils/common");
const { handleResponse, handleError } = require("@utils/responses");
const { default: mongoose } = require("mongoose");
const CompanyService = require("@services/company");
const {generateLayoutSettingsForWineCellar} = require("@utils/generateFormats");
const {wineCellarLayouts} = require("@seeders/wineCellarLayoutSeeder");

exports.getAll = async (req, res) => {
    const company_id = req.user.company_id;
    Service.findAllWithDetail({ company_id: new mongoose.Types.ObjectId(company_id) })
        .then((records) => {
            handleResponse(res, 200, "All Records", records);
        })
        .catch((err) => {
            handleError(res, err);
        });
};

exports.getAllLayoutsForEstimate = async (req ,res) => {
    const company_id = req.user.company_id;
    Service.findAll({ company_id })
        .then((records) => {
            handleResponse(res, 200, "All Records", records);
        })
        .catch((err) => {
            handleError(res, err);
        });
}

exports.getSingle = async (req, res) => {
    const { id } = req.params;
    Service.findBy({ _id: id })
        .then(async (record) => {
            const company_id = req.user.company_id;
            const listData = await getWineCellarHardwareList(company_id);
            handleResponse(res, 200, "Success", {
                layoutData: record,
                listData: listData,
            });
        })
        .catch((err) => {
            handleError(res, err);
        });
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const payload = { ...req.body };
    const data = await nestedObjectsToDotNotation(payload);
    Service.update({ _id: id }, data)
        .then((record) => {
            handleResponse(res, 200, "Record updated successfully", record);
        })
        .catch((err) => {
            handleError(res, err);
        });
};

exports.deleteRecord = async (req, res) => {
    const { id } = req.params;
    Service.delete({ _id: id })
        .then((record) => {
            handleResponse(res, 200, "Record deleted successfully", record);
        })
        .catch((err) => {
            handleError(res, err);
        });
};

exports.save = async (req, res) => {
    const data = { ...req.body };
    Service.create(data)
        .then((record) => {
            handleResponse(res, 200, "Record created successfully", record);
        })
        .catch((err) => {
            handleError(res, err);
        });
};

exports.updateExistingCollection = async (req, res) => {
    const companies = await CompanyService.findAll();
    try {
        await Promise.all(
            companies.map(async (company) => {
              const layoutPromises =  wineCellarLayouts?.map(async (layout) => {
                     let settings = {};
                     settings = await generateLayoutSettingsForWineCellar(
                            layout?.settings,
                            company?.id
                        );
                    return Service.create({
                            name: layout?.name,
                            image: layout?.image,
                            company_id: new mongoose.Types.ObjectId(company?.id),
                            settings: { ...settings },
                    });
                });
                // Await all hardware creations for the current company
                await Promise.all(layoutPromises);
            })
        );
        handleResponse(res, 200, "Records created successfully.");
    } catch (err) {
        handleError(res, err);
    }
};