const Model = require("@models/contacts");
const { fetchAllRecords } = require("@utils/DB_Pipelines/contacts");

class ContactService {
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

  static findAllWithPipeline(condition, search, options) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchAllRecords(condition, search, {
        skip: options?.skip,
        limit: options?.limit,
      });
      Model.aggregate(pipeline)
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
        .then((staff) => {
          resolve(staff);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      Model.findOneAndDelete(condition)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteAll(condition) {
    return new Promise((resolve, reject) => {
      Model.deleteMany(condition)
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
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = ContactService;
