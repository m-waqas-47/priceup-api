const Company = require("../../models/companies");

class CompanyService {
  static findAll(data) {
    return new Promise((resolve, reject) => {
      Company.find(data)
        .sort({ createdAt: "desc" })
        .then((companies) => {
          resolve(companies);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findBy(data) {
    return new Promise((resolve, reject) => {
      Company.findOne(data)
        .then((company) => {
          resolve(company);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static update(condition, data) {
    return new Promise((resolve, reject) => {
      Company.findOneAndUpdate(condition, data, { new: true })
        .then((company) => {
          resolve(company);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(condition) {
    return new Promise((resolve, reject) => {
      Company.findOneAndDelete(condition)
        .then((company) => {
          resolve(company);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static count(condition) {
    return new Promise((resolve, reject) => {
      Company.countDocuments(condition)
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
      Company.create(data)
        .then((company) => {
          resolve(company);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = CompanyService;
