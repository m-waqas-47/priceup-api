const { fetchAllLocationsForCustomAdmin } = require("@utils/DB_Pipelines/companies");
const CustomUser = require("../../models/customUsers");

class CustomUserService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      CustomUser.find(data)
        .sort({ createdAt: "desc" })
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

  static findAllLocations(condition, filter) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchAllLocationsForCustomAdmin(
        condition,
        filter.search
      );
      CustomUser.aggregate(pipeline)
        .then((result) => {
          resolve(result);
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

  static count(condition) {
    return new Promise((resolve, reject) => {
      CustomUser.countDocuments(condition)
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
