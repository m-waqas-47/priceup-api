const GlassType = require("../../models/glassTypes");

class GlassTypeService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      GlassType.find(data).sort({createdAt: "asc"})
        .then((glassTypes) => {
          resolve(glassTypes);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      GlassType.findOne(data)
        .then((glassType) => {
          resolve(glassType);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data) {
    return new Promise((resolve, reject) => {
      GlassType.findOneAndUpdate(condition, data, { new: true })
        .then((glassType) => {
          resolve(glassType);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      GlassType.findOneAndDelete(condition)
        .then((glassType) => {
          resolve(glassType);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      GlassType.create(data)
        .then((glassType) => {
          resolve(glassType);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = GlassTypeService;
