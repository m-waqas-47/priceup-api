const { fetchAllRecords } = require("@utils/DB_Pipelines/users");
const Admin = require("../../models/admins");

class AdminService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      Admin.find(data)
        .sort({ createdAt: "desc" })
        .then((admins) => {
          resolve(admins);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findAllUsers(condition, search = "", options = {}) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchAllRecords(condition, search, options);
      Admin.aggregate(pipeline)
        .then((result) => {
          if (
            options &&
            options.skip !== undefined &&
            options.limit !== undefined
          ) {
            resolve(result[0]);
          } else {
            resolve(result);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      Admin.findOne(data)
        .then((admin) => {
          resolve(admin);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data) {
    return new Promise((resolve, reject) => {
      Admin.findOneAndUpdate(condition, data, { new: true })
        .then((admin) => {
          resolve(admin);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      Admin.findOneAndDelete(condition)
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(condition) {
    return new Promise((resolve, reject) => {
      Admin.countDocuments(condition)
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
      Admin.create(data)
        .then((admin) => {
          resolve(admin);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = AdminService;
