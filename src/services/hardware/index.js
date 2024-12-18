const { fetchAllGroupByCategory } = require("@utils/DB_Pipelines/hardwares");
const Hardware = require("../../models/hardwares");
class HardwareService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      Hardware.find(data)
        .sort({ createdAt: "desc" })
        .then((hardwares) => {
          resolve(hardwares);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findAllBy(data) {
    return new Promise((resolve, reject) => {
      Hardware.find(data)
        .sort({ createdAt: "desc" })
        .then((hardwares) => {
          resolve(hardwares);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findAllGroupByCategory(condition) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchAllGroupByCategory(condition);
      Hardware.aggregate(pipeline)
        .then((result) => resolve(result[0]))
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      Hardware.findOne(data)
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
      Hardware.findOneAndUpdate(condition, data, { new: true })
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
      Hardware.findOneAndDelete(condition)
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
      Hardware.deleteMany(condition)
        .then((hardware) => {
          resolve(hardware);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(condition) {
    return new Promise((resolve, reject) => {
      Hardware.countDocuments(condition)
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
      Hardware.create(data)
        .then((hardware) => {
          resolve(hardware);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = HardwareService;
