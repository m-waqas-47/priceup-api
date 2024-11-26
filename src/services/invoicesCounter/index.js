const Model = require("@models/invoicesCounter");

class InvoicesCounterService {
  static update(condition, data, options) {
    return new Promise((resolve, reject) => {
      Model.findOneAndUpdate(condition, data, options)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(condition) {
    return new Promise((resolve, reject) => {
      Model.countDocuments(condition)
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
      Model.create(data)
        .then((record) => {
          resolve(record);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = InvoicesCounterService;
