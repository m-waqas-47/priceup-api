const CustomUser = require("../../models/customUsers");

class CustomUserService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      CustomUser.find(data)
        .sort({ createdAt: "asc" })
        .then((customUsers) => {
          resolve(customUsers);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      CustomUser.findOne(data)
        .then((customUser) => {
          resolve(customUser);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data) {
    return new Promise((resolve, reject) => {
      CustomUser.findOneAndUpdate(condition, data, { new: true })
        .then((customUser) => {
          resolve(customUser);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      CustomUser.findOneAndDelete(condition)
        .then((customUser) => {
          resolve(customUser);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static create(data) {
    return new Promise((resolve, reject) => {
      CustomUser.create(data)
        .then((customUser) => {
          resolve(customUser);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = CustomUserService;
