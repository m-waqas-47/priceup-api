const { fetchRecordsWithRelativeLocation } = require("@utils/DB_Pipelines/users");
const User = require("../../models/users");
class UserService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      User.find(data)
        .sort({ createdAt: "desc" })
        .then((users) => {
          resolve(users);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findAllWithRelativeLocation(condition) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchRecordsWithRelativeLocation(condition);
      User.aggregate(pipeline)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      User.findOne(data)
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data) {
    return new Promise((resolve, reject) => {
      User.findOneAndUpdate(condition, data, { new: true })
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      User.findOneAndDelete(condition)
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
      User.countDocuments(condition)
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
      User.create(data)
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = UserService;
