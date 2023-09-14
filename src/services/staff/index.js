const Staff = require("../../models/staffs");

class StaffService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      Staff.find(data).sort({createdAt: "asc"})
        .then((staffs) => {
          resolve(staffs);
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
