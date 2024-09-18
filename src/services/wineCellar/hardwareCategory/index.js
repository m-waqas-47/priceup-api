const Model = require("@models/wineCellar/hardwareCategories");
class WineCellarHardwareCategoryService {
    static findAll(condition) {
        return new Promise((resolve, reject) => {
            Model.find(condition)
                .sort({ createdAt: "desc" })
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
                .then((category) => {
                    resolve(category);
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
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

module.exports = WineCellarHardwareCategoryService;
