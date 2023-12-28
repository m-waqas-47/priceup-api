const Estimate = require("../../models/estimates");

class EstimateService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      Estimate.find(data)
        .sort({ createdAt: "desc" })
        .then((estimates) => {
          resolve(estimates);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findOne(data) {
    return new Promise((resolve, reject) => {
      Estimate.findOne(data)
        .then((estimate) => {
          resolve(estimate);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      Estimate.findOne(data)
        .then((estimate) => {
          resolve(estimate);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data) {
    return new Promise((resolve, reject) => {
      Estimate.findOneAndUpdate(condition, data, { new: true })
        .then((estimate) => {
          resolve(estimate);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      Estimate.findOneAndDelete(condition)
        .then((estimate) => {
          resolve(estimate);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteAll(condition) {
    return new Promise((resolve, reject) => {
      Estimate.deleteMany(condition)
        .then((estimate) => {
          resolve(estimate);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(data) {
    return new Promise((resolve, reject) => {
      Estimate.countDocuments(data)
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
      Estimate.create(data)
        .then((estimate) => {
          resolve(estimate);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = EstimateService;
