const { fetchAllRecords } = require("@utils/DB_Pipelines/wineCellar/layouts");
const Model = require("@models/wineCellar/layouts");

class WineCellarLayoutService {
    static findAll(data) {
        return new Promise((resolve, reject) => {
            Model.find(data)
                .sort({ createdAt: "desc" })
                .then((records) => {
                    resolve(records);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static findAllWithDetail(condition) {
        return new Promise((resolve, reject) => {
            const pipeline = fetchAllRecords(condition);
            Model.aggregate(pipeline)
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static findBy(condition) {
        return new Promise((resolve, reject) => {
            Model.findOne(condition)
                .then((record) => {
                    resolve(record);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static update(condition, data) {
        return new Promise((resolve, reject) => {
            Model.findOneAndUpdate(condition, data, { new: true })
                .then((record) => {
                    resolve(record);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static delete(condition) {
        return new Promise((resolve, reject) => {
            Model.findOneAndDelete(condition)
                .then((record) => {
                    resolve(record);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static deleteAll(condition) {
        return new Promise((resolve, reject) => {
            Model.deleteMany(condition)
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static count(condition) {
        return new Promise((resolve, reject) => {
            Model.countDocuments(condition)
                .then((count) => {
                    resolve(count);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static create(data) {
        return new Promise((resolve, reject) => {
            Model.create(data)
                .then((record) => {
                    resolve(record);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

module.exports = WineCellarLayoutService;