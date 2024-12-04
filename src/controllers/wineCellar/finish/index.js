const Service = require("@services/wineCellar/finish");
const WineCellarHardwareService = require("@services/wineCellar/hardware");
const { handleResponse, handleError } = require("@utils/responses");
const { addOrUpdateOrDelete } = require("@services/multer");
const { multerActions, multerSource } = require("@config/common");
const WineCellarFinishService = require("@services/wineCellar/finish");
const CompanyService = require("@services/company");
const { wineCellarFinishes } = require("@seeders/wineCellarFinishSeeder");
const assetsPath = `images/${multerSource.WINECELLARFINISHES}/uploads`;

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
            handleResponse(res, 200, "Success", record);
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
                "Finish with exact name already exist. Please name it to something else."
            );
        }
        if (req.file && req.file.fieldname === "image") {
            data.image = await addOrUpdateOrDelete(
                multerActions.SAVE,
                multerSource.WINECELLARFINISHES,
                req.file.path
            );
        }
        const finish = await Service.create({
            ...data,
        });

        const hardwares = await WineCellarHardwareService.findAll({ company_id: company_id });
        await Promise.all(
            hardwares.map(async (hardware) => {
                const finishData = {
                    name: finish.name,
                    image: finish.image,
                    partNumber: finish.partNumber,
                    cost: finish.cost,
                    status: finish.status,
                    finish_id: finish._id,
                };
                await WineCellarHardwareService.update(
                    { _id: hardware._id },
                    {
                        $push: { finishes: finishData },
                    },
                    {new: true}
                );
            })
        );

        handleResponse(res, 200, "Record created successfully", finish);
    } catch (err) {
        handleError(res, err);
    }
};

exports.deleteRecord = async (req, res) => {
    const { id } = req.params;
    const company_id = req.user.company_id;
    try {
        const finish = await Service.delete({ _id: id });
        if (
            finish &&
            finish.image &&
            finish.image?.startsWith(assetsPath)
        ) {
            await addOrUpdateOrDelete(
                multerActions.DELETE,
                multerSource.WINECELLARFINISHES,
                finish.image
            );
        }
        const hardwares = await WineCellarHardwareService.findAll({ company_id: company_id });
        hardwares?.map(async (hardware) => {
            WineCellarHardwareService.update(
                { _id: hardware._id },
                { $pull: { finishes: { finish_id: id } } },{new: true}
            );
        });
        handleResponse(res, 200, "Record deleted successfully", finish);
    } catch (err) {
        handleError(res, err);
    }
};
exports.update = async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };
    const company_id = req.user.company_id;

    try {
        const oldRecord = await Service.findBy({ _id: id });

        if (req.file && req.file.fieldname === "image") {
            data.image = await addOrUpdateOrDelete(
                multerActions.PUT,
                multerSource.WINECELLARFINISHES,
                req.file.filename,
                oldRecord.image
            );
        }

        await Service.update({ _id: id }, data);

        const hardwares = await WineCellarHardwareService.findAll({ company_id: company_id });
        for (const hardware of hardwares) {
            const items = hardware?.finishes?.filter(
                (item) => item.finish_id.toString() === id
            );
            for (const item of items) {
                await WineCellarHardwareService.update(
                    { _id: hardware._id, "finishes._id": item._id },
                    {
                        $set: {
                            "finishes.$.name": data?.name,
                            "finishes.$.image": data?.image,
                        },
                    },
                    {new: true}
                );
            }
        }

        handleResponse(res, 200, "Record updated successfully", data);
    } catch (err) {
        console.error(err);
        handleError(res, err);
    }
};

exports.updateExistingCollection = async (req, res) => {
    const companies = await CompanyService.findAll();
    try {
        await Promise.all(
            companies.map(async (company) => {
              await Promise.all(
                wineCellarFinishes.map(async (record) => {
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