const MirrorHardwares = require("@models/mirror/hardwares");

class MirrorHardwareService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      MirrorHardwares.find(data)
        .sort({ createdAt: "desc" })
        .then((hardwares) => {
          resolve(hardwares);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      MirrorHardwares.findOne(data)
        .then((hardware) => {
          resolve(hardware);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data) {
    return new Promise((resolve, reject) => {
      MirrorHardwares.findOneAndUpdate(condition, data, { new: true })
        .then((hardware) => {
          resolve(hardware);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      MirrorHardwares.findOneAndDelete(condition)
        .then((hardware) => {
          resolve(hardware);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteAll(condition) {
    return new Promise((resolve, reject) => {
      MirrorHardwares.deleteMany(condition)
        .then((hardwares) => {
          resolve(hardwares);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(condition) {
    return new Promise((resolve, reject) => {
      MirrorHardwares.countDocuments(condition)
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
      MirrorHardwares.create(data)
        .then((hardware) => {
          resolve(hardware);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = MirrorHardwareService;
