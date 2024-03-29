const GlassType = require("../../models/glassTypes");

class GlassTypeService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      GlassType.find(data)
        .sort({ createdAt: "desc" })
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

  static deleteAll(condition) {
    return new Promise((resolve, reject) => {
      GlassType.deleteMany(condition)
        .then((glassType) => {
          resolve(glassType);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(condition) {
    return new Promise((resolve, reject) => {
      GlassType.countDocuments(condition)
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
