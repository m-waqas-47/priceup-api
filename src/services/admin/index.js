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
