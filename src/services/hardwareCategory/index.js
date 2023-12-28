const HardwareCategory = require("../../models/hardwareCategories");
class HardwareCategoryService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      HardwareCategory.find(data)
        .sort({ createdAt: "desc" })
        .then((users) => {
          resolve(users);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      HardwareCategory.findOne(data)
        .then((category) => {
          resolve(category);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      HardwareCategory.create(data)
        .then((category) => {
          resolve(category);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = HardwareCategoryService;
