const { userRoles } = require("@config/common");
const Company = require("../../models/companies");
const {
  fetchAllLocationsForSuperAdmin,
  fetchTopPerfromingCompaniesWithActiveInactiveCount,
} = require("@utils/DB_Pipelines/companies");

class CompanyService {
  static findAll(condition, projection = "") {
    return new Promise((resolve, reject) => {
      Company.find(condition, projection)
        .sort({ createdAt: "desc" })
        .then((companies) => {
          resolve(companies);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findTopPerformingCompanies(condition) {
    return new Promise((resolve, reject) => {
      const pipeline = fetchTopPerfromingCompaniesWithActiveInactiveCount(condition);
      Company.aggregate(pipeline)
        .then((result) => {
          resolve(result[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findAllByRole(role, filter) {
    return new Promise((resolve, reject) => {
      let pipeline = [];
      if (role === userRoles.SUPER_ADMIN) {
        pipeline = fetchAllLocationsForSuperAdmin(filter.search, filter.status);
      }
      Company.aggregate(pipeline)
        .then((result) => {
          resolve(result[0]);
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

  static updateMany(condition, data) {
    return new Promise((resolve, reject) => {
      Company.updateMany(condition, data)
        .then(() => {
          resolve(true);
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
