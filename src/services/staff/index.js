const { fetchAllLocationsForStaff } = require("@utils/DB_Pipelines/companies");
const Staff = require("../../models/staffs");
const { fetchAllRecords } = require("@utils/DB_Pipelines/staffs");

class StaffService {
  static findAll(condition = {}, search = "", options = {}) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchAllRecords(condition, search, options);
      Staff.aggregate(pipeline)
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
      Staff.findOne(data)
        .then((staff) => {
          resolve(staff);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findAllLocations(condition, filter) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchAllLocationsForStaff(condition, filter.search);
      Staff.aggregate(pipeline)
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
      Staff.findOneAndUpdate(condition, data, { new: true })
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
      Staff.findOneAndDelete(condition)
        .then((staff) => {
          resolve(staff);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static deleteAll(condition) {
    return new Promise((resolve, reject) => {
      Staff.deleteMany(condition)
        .then((staff) => {
          resolve(staff);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(condition) {
    return new Promise((resolve, reject) => {
      Staff.countDocuments(condition)
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
      Staff.create(data)
        .then((staff) => {
          resolve(staff);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = StaffService;
