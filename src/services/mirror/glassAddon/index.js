const MirrorGlassAddons = require("@models/mirror/glassAddons");

class MirrorGlassAddonService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      MirrorGlassAddons.find(data)
        .sort({ createdAt: "desc" })
        .then((glassAddons) => {
          resolve(glassAddons);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      MirrorGlassAddons.findOne(data)
        .then((glassAddon) => {
          resolve(glassAddon);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data) {
    return new Promise((resolve, reject) => {
      MirrorGlassAddons.findOneAndUpdate(condition, data, { new: true })
        .then((glassAddon) => {
          resolve(glassAddon);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      MirrorGlassAddons.findOneAndDelete(condition)
        .then((glassAddon) => {
          resolve(glassAddon);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteAll(condition) {
    return new Promise((resolve, reject) => {
      MirrorGlassAddons.deleteMany(condition)
        .then((glassAddon) => {
          resolve(glassAddon);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(condition) {
    return new Promise((resolve, reject) => {
      MirrorGlassAddons.countDocuments(condition)
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
      MirrorGlassAddons.create(data)
        .then((glassAddon) => {
          resolve(glassAddon);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = MirrorGlassAddonService;
