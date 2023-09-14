const GlassAddon = require("../../models/glassAddons");

class GlassAddonService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      GlassAddon.find(data).sort({createdAt: "asc"})
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
      GlassAddon.findOne(data)
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
      GlassAddon.findOneAndDelete(condition)
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
      GlassAddon.findOneAndUpdate(condition, data, { new: true })
        .then((glassAddon) => {
          resolve(glassAddon);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      GlassAddon.create(data)
        .then((glassAddon) => {
          resolve(glassAddon);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = GlassAddonService;
