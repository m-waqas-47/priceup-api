const Model = require("@models/invoices");

class InvoiceService {
  static findAll(condition) {
    return new Promise((resolve, reject) => {
      Model.find(condition)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(condition) {
    return new Promise((resolve, reject) => {
      Model.findOne(condition)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data, options) {
    return new Promise((resolve, reject) => {
      Project.findOneAndUpdate(condition, data, options)
        .then((record) => {
          resolve(record);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateMany(condition, data) {
    return new Promise((resolve, reject) => {
      Model.updateMany(condition, data)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      Model.findOneAndDelete(condition)
        .then((record) => {
          resolve(record);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteAll(condition) {
    return new Promise((resolve, reject) => {
      Model.deleteMany(condition)
        .then((record) => {
          resolve(record);
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

module.exports = InvoiceService;
