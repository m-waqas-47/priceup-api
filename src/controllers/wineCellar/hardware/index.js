const Service = require("@services/wineCellar/hardware");
const {handleResponse, handleError} = require("@utils/responses");
const {addOrUpdateOrDelete} = require("@services/multer");
const {multerActions, multerSource} = require("@config/common");
const WineCellarFinishService = require("@services/wineCellar/finish");
const {nestedObjectsToDotNotation,generateFinishes} = require("@utils/common");
const CompanyService = require("@services/company");
const {wineCellarHardware} = require("@seeders/wineCellarHardwareSeeder");
const assetsPath = `images/${multerSource.WINECELLARHARDWARES}/uploads`;

exports.getAll = async (req, res) => {
    const company_id = req.user.company_id;
    Service.findAll({ company_id: company_id })
        .then((records) => {
            handleResponse(res, 200, "All records", records);
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
                multerSource.WINECELLARHARDWARES,
                record.image
            );
        }
        handleResponse(res, 200, "Record deleted successfully", record);
    } catch (err) {
        handleError(res, err);
    }
};

exports.getRecordsByCategory = async (req, res) => {
    const { slug } = req.params;
    const company_id = req.user.company_id;
    Service.findAllBy({
        hardware_category_slug: slug,
        company_id: company_id,
    })
        .then((records) => {
            handleResponse(res, 200, "All Records", records);
        })
        .catch((err) => {
            handleError(res, err);
        });
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
                "Hardware with exact name already exist. Please name it to something else."
            );
        }

        if (req.file && req.file.fieldname === "image") {
            data.image = await addOrUpdateOrDelete(
                multerActions.SAVE,
                multerSource.WINECELLARHARDWARES,
                req.file.path
            );
        }

        const finishes = await WineCellarFinishService.findAll({ company_id: company_id });
        const generateFinishesFormat = await generateFinishes(finishes);
        const hardware = await Service.create({
            ...data,
            finishes: generateFinishesFormat,
        });
        handleResponse(res, 200, "Record created successfully", hardware);
    } catch (err) {
        handleError(res, err);
    }
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
                multerSource.WINECELLARHARDWARES,
                req.file.filename,
                oldRecord.image
            );
        }
        const hardware = await Service.update({ _id: id }, updatedData);
        handleResponse(res, 200, "Record updated successfully", hardware);
    } catch (err) {
        handleError(res, err);
    }
};

exports.updateExistingCollection = async (req, res) => {
    const companies = await CompanyService.findAll();
    try {
        await Promise.all(
            companies.map(async (company) => {
                const companyFinishes = await WineCellarFinishService.findAll({
                    company_id: company?.id,
                }); // Fetch all finishes for this company

                // Map over hardware and ensure all creations are processed concurrently
                const hardwarePromises = wineCellarHardware.map(async (hardware) => {
                    // Map hardware finishes to the company finishes
                    const finishes = hardware?.finishes?.map((hardwareFinish) => {
                        const finish = companyFinishes?.find(
                            (item) => item?.slug === hardwareFinish?.finish_id
                        );
                        return { ...hardwareFinish, finish_id: finish?._id };
                    });

                    // Create location hardware
                    return Service.create({
                        ...hardware,
                        company_id: company?.id,
                        finishes: finishes,
                    });
                });

                // Await all hardware creations for the current company
                await Promise.all(hardwarePromises);
            })
        );
        handleResponse(res, 200, "Records created successfully.");
    } catch (err) {
        handleError(res, err);
    }
};


