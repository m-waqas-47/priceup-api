const { fetchAllRecords } = require("@utils/DB_Pipelines/estimates");
const Estimate = require("../../models/estimates");

class EstimateService {
  static findAllWithPipeline(condition, search, options) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchAllRecords(condition, search, {
        skip: options?.skip || 0,
        limit: options?.limit || 0,
      });
      Estimate.aggregate(pipeline)
        .then((result) => {
          const { totalRecords, estimates } = result[0];
          resolve({ totalRecords, estimates });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  static findAll(query, options) {
    return new Promise((resolve, reject) => {
      Estimate.find(query)
        .skip(options?.skip ?? 0)
        .limit(options?.limit ?? 0)
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

  static count(condition) {
    return new Promise((resolve, reject) => {
      Estimate.countDocuments(condition)
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
