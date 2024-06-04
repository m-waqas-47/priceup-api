const MirrorGlassTypes = require("@models/mirror/glassTypes");

class MirrorGlassTypeService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      MirrorGlassTypes.find(data)
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
      MirrorGlassTypes.findOne(data)
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
      MirrorGlassTypes.findOneAndUpdate(condition, data, { new: true })
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
      MirrorGlassTypes.findOneAndDelete(condition)
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
      MirrorGlassTypes.deleteMany(condition)
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
      MirrorGlassTypes.countDocuments(condition)
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
      MirrorGlassTypes.create(data)
        .then((glassType) => {
          resolve(glassType);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = MirrorGlassTypeService;
